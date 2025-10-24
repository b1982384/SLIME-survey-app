#!/usr/bin/env python3
import argparse
import json
import math
import os
import sys
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import difflib
import numpy as np
import pandas as pd

try:
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except Exception:
    MATPLOTLIB_AVAILABLE = False



# Hardcoded defaults (edit these if your file names change)
DEFAULT_INPUT = os.path.expanduser("~/Desktop/df_short.csv")
DEFAULT_OUT_SCORES = os.path.expanduser("~/Desktop/factor_scores.csv")
DEFAULT_OUT_DISTS  = os.path.expanduser("~/Desktop/factor_distributions.json")
DEFAULT_DELIMITER = None  # set to "," for strict CSV, or "\t" for TSV; None = auto-detect


SEVEN_POINT_QUESTIONS: List[str] = [
    "I like to explore songs from all genres",
    "I feel like I play a strong role in how things are recommended to me",
    "I worry that my music platform recommends music for its own interests not mine",
    "I keep up with popular/trending songs",
    "I think that popular artists are popular because they make better music",
    "I can rely on my music platform's recommendations when I want to hear something new",
    "I avoid app-curated playlists and mixes – I prefer my own",
    "I frequently listen to music by artists I haven't heard before",
    "I think that artists make better music when they aren't really popular",
    "I prefer to skip songs the platform adds or suggests automatically",
    "I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)",
    "I don't like the music my friends listen to",
    "I choose music without considering how I'm feeling",
    "I feel uneasy letting the platform decide what to play next",
    "I use music to better understand or make sense of my emotions",
]

FIVE_POINT_QUESTIONS: List[str] = [
    "How often do you make and create playlists on your music platform?",
    "How often do you listen to unfamiliar music?",
    "How often do you make playlists for friends?",
    "When you hear a new song from a playlist, autoplay, or other passive source, how often do you look up the artist or track to learn more?",
    "How often do you listen to music via full albums?",
    "How often do you collect physical music formats?",
    "How often do you make playlists for yourself?",
    "How often do you add to or edit your existing playlists?",
    "When you hear a new song from a playlist, autoplay, or other passive source, how often do you save or like it to return to later?",
]

# Concatenate to a 24-length canonical list, indices 0..23
CANONICAL_QUESTIONS = SEVEN_POINT_QUESTIONS + FIVE_POINT_QUESTIONS

# Indices 15..23 are 5-point questions
FIVE_POINT_INDICES = set(range(15, 24))

# Reverse-scored indices (from your app): index 12 only
NEGATIVELY_WEIGHTED = {12}

# Map original question index -> factor number (1..8) (from your app)
QUESTION_TO_FACTOR: Dict[int, int] = {
    # Factor 1
    5: 1, 10: 1, 1: 1,
    # Factor 2
    13: 2, 9: 2, 6: 2,
    # Factor 3
    22: 3, 21: 3, 15: 3,
    # Factor 4
    8: 4, 11: 4, 2: 4,
    # Factor 5
    19: 5, 4: 5, 12: 5,
    # Factor 6
    3: 6, 18: 6, 23: 6,
    # Factor 7
    16: 7, 0: 7, 7: 7,
    # Factor 8
    20: 8, 17: 8, 14: 8,
}

# Bins for distributions (0-20%, 20-40%, 40-60%, 60-80%, 80-100%)
BINS = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0000001]  # last slightly >1 to include 1.0


@dataclass
class MappingResult:
    # Map DataFrame column name -> canonical index (0..23)
    col_to_idx: Dict[str, int]
    # Map column name -> (matched canonical question, similarity ratio)
    details: Dict[str, Tuple[str, float]]
    # Index of the label row (question text row), or None if none
    label_row_index: Optional[int]


def _is_number_like(v) -> bool:
    if v is None:
        return False
    if isinstance(v, (int, float, np.integer, np.floating)):
        return not (isinstance(v, float) and math.isnan(v))
    # Attempt parse
    try:
        float(str(v).strip())
        return True
    except Exception:
        return False


def _best_match(q: str, candidates: List[str]) -> Tuple[int, float]:
    # Return (index, score) of best fuzzy match
    ratios = [difflib.SequenceMatcher(None, q.lower().strip(), c.lower().strip()).ratio()
              for c in candidates]
    best_idx = int(np.argmax(ratios))
    return best_idx, ratios[best_idx]


def build_mapping(df: pd.DataFrame, threshold: float = 0.55) -> MappingResult:
    """
    Attempts to build a mapping from CSV columns to canonical question indices using
    the 'question text' row (common in survey exports).

    - If the second row (index 0-based: 0 is the header, 1 is the first data row) is mostly non-numeric,
      treat it as the label row.
    - Fuzzy-match each label cell to the canonical list.
    - If no label row is detected, fall back to positional mapping (left-to-right).
    """
    label_row_index = None
    col_to_idx: Dict[str, int] = {}
    details: Dict[str, Tuple[str, float]] = {}

    # Try to detect a label row: a row where most entries are non-numeric strings
    candidate_label_row = None
    if len(df) > 0:
        # Check first row
        row0 = df.iloc[0]
        non_numeric = sum(1 for v in row0 if not _is_number_like(v))
        if non_numeric >= max(8, int(0.6 * len(row0))):
            candidate_label_row = 0
        elif len(df) > 1:
            # Check second row
            row1 = df.iloc[1]
            non_numeric1 = sum(1 for v in row1 if not _is_number_like(v))
            if non_numeric1 >= max(8, int(0.6 * len(row1))):
                candidate_label_row = 1

    # Build mapping using label row if available
    if candidate_label_row is not None:
        label_row_index = candidate_label_row
        used_indices = set()

        for col in df.columns:
            text = str(df.loc[label_row_index, col])
            best_idx, score = _best_match(text, CANONICAL_QUESTIONS)

            # Avoid duplicates; if already used, try next best
            # Simple approach: if conflict, slightly degrade threshold and try brute force
            if best_idx in used_indices:
                # Try next best by removing the current best temporarily
                ratios = [difflib.SequenceMatcher(None, text.lower().strip(), c.lower().strip()).ratio()
                          for c in CANONICAL_QUESTIONS]
                order = np.argsort(ratios)[::-1]  # descending
                assigned = False
                for idx in order:
                    idx = int(idx)
                    if idx not in used_indices and ratios[idx] >= threshold - 0.05:
                        best_idx, score = idx, ratios[idx]
                        assigned = True
                        break
                if not assigned:
                    # Fall back to first unused index if any
                    for idx in range(len(CANONICAL_QUESTIONS)):
                        if idx not in used_indices:
                            best_idx, score = idx, ratios[idx]
                            assigned = True
                            break

            used_indices.add(best_idx)
            if score < threshold:
                # Still assign, but note low confidence
                pass
            col_to_idx[col] = best_idx
            details[col] = (CANONICAL_QUESTIONS[best_idx], float(score))
    else:
        # Fallback: positional mapping
        for i, col in enumerate(df.columns):
            if i < len(CANONICAL_QUESTIONS):
                col_to_idx[col] = i
                details[col] = (CANONICAL_QUESTIONS[i], 1.0)
        label_row_index = None

    return MappingResult(col_to_idx=col_to_idx, details=details, label_row_index=label_row_index)


def normalize_response(idx: int, value: Optional[float]) -> Optional[float]:
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    try:
        v = float(value)
    except Exception:
        try:
            v = float(str(value).strip())
        except Exception:
            return None

    if idx in FIVE_POINT_INDICES:
        norm = (v - 1.0) / 4.0
    else:
        norm = (v - 1.0) / 6.0

    if idx in NEGATIVELY_WEIGHTED:
        norm = 1.0 - norm

    # Clamp to [0,1] in case of out-of-range values
    return max(0.0, min(1.0, norm))


def score_row(row: pd.Series, mapping: MappingResult) -> Dict[int, float]:
    # Accumulate sums and counts per factor
    sums = {f: 0.0 for f in range(1, 9)}
    counts = {f: 0 for f in range(1, 9)}

    for col, idx in mapping.col_to_idx.items():
        if col not in row:
            continue
        val = row[col]
        norm = normalize_response(idx, val)
        if norm is None:
            continue
        factor = QUESTION_TO_FACTOR.get(idx)
        if factor is None:
            continue
        sums[factor] += norm
        counts[factor] += 1

    # Average per factor
    scores = {}
    for f in range(1, 9):
        if counts[f] > 0:
            scores[f] = sums[f] / counts[f]
        else:
            scores[f] = np.nan
    return scores


def compute_distributions(per_user_scores: List[Dict[int, float]]) -> Dict[int, Dict]:
    """
    Return { factor: { 'bins': [counts for each bin edge], 'bin_edges': [...]} }
    """
    by_factor = {f: [] for f in range(1, 9)}
    for s in per_user_scores:
        for f in range(1, 9):
            v = s.get(f)
            if v is not None and not (isinstance(v, float) and math.isnan(v)):
                by_factor[f].append(float(v))

    out = {}
    for f in range(1, 9):
        vals = by_factor[f]
        counts, edges = np.histogram(vals, bins=BINS)
        # Convert to simple structure
        bins = []
        for i in range(len(edges) - 1):
            bins.append({
                "range": f"{int(edges[i]*100)}-{int(edges[i+1]*100)}%",
                "count": int(counts[i]),
                "min": float(edges[i]),
                "max": float(edges[i+1]),
            })
        out[f] = {"bins": bins, "bin_edges": [float(e) for e in edges], "n": int(len(vals))}
    return out


def main():
    parser = argparse.ArgumentParser(description="Score survey CSV and build factor distributions.")
    parser.add_argument("--input", "-i", default=DEFAULT_INPUT, help="Path to CSV/TSV file with responses.")
    parser.add_argument("--out-scores", default=DEFAULT_OUT_SCORES, help="Output CSV with per-respondent factor scores (0..1).")
    parser.add_argument("--out-dists", default=DEFAULT_OUT_DISTS, help="Output JSON with histogram counts per factor.")
    parser.add_argument("--make-plots", action="store_true", help="Save per-factor histogram PNGs into ./plots/")
    parser.add_argument("--delimiter", default=DEFAULT_DELIMITER, help="Delimiter override: ',', '\\t', or leave empty for auto-detect.")
    args = parser.parse_args()

    # Read file (auto-detect separator if not specified)
    read_kwargs = {}
    if args.delimiter in (",", "\t"):
        read_kwargs["sep"] = args.delimiter
    else:
        read_kwargs["sep"] = None  # auto-detect
        read_kwargs["engine"] = "python"

    df = pd.read_csv(args.input, **read_kwargs)

    try:
        df = pd.read_csv(args.input, **read_kwargs)
    except Exception as e:
        print(f"Error reading {args.input}: {e}", file=sys.stderr)
        sys.exit(1)

    if df.empty:
        print("Input file has no rows.", file=sys.stderr)
        sys.exit(1)

    # Build mapping from CSV columns -> canonical indices using potential label row
    mapping = build_mapping(df)

    # Drop the label row if detected
    data_df = df.copy()
    if mapping.label_row_index is not None and 0 <= mapping.label_row_index < len(data_df):
        data_df = data_df.drop(index=mapping.label_row_index)

    # Score each respondent
    per_user_scores: List[Dict[int, float]] = []
    for _, row in data_df.iterrows():
        scores = score_row(row, mapping)
        per_user_scores.append(scores)

    # Save per-user factor scores to CSV
    out_rows = []
    for i, s in enumerate(per_user_scores):
        row = {"respondent_index": i}
        for f in range(1, 9):
            row[f"factor_{f}"] = s.get(f, np.nan)
        # optional: top factor
        try:
            valid = {f: v for f, v in s.items() if v is not None and not math.isnan(v)}
            top_factor = max(valid.items(), key=lambda kv: kv[1])[0] if valid else ""
        except Exception:
            top_factor = ""
        row["top_factor"] = top_factor
        out_rows.append(row)

    out_scores_df = pd.DataFrame(out_rows)
    out_scores_df.to_csv(args.out_scores, index=False)
    print(f"Wrote per-respondent factor scores to: {args.out_scores}")

    # Compute and save distributions
    dists = compute_distributions(per_user_scores)
    with open(args.out_dists, "w") as f:
        json.dump(dists, f, indent=2)
    print(f"Wrote factor distributions to: {args.out_dists}")

    # Optionally generate plots
    if args.make_plots:
        if not MATPLOTLIB_AVAILABLE:
            print("matplotlib not available; install it or omit --make-plots.", file=sys.stderr)
        else:
            out_dir = "plots"
            os.makedirs(out_dir, exist_ok=True)
            for f in range(1, 9):
                bins = dists[f]["bins"]
                counts = [b["count"] for b in bins]
                labels = [b["range"] for b in bins]
                plt.figure(figsize=(4, 3))
                plt.bar(labels, counts, color="#3b82f6")
                plt.title(f"Factor {f} distribution")
                plt.xlabel("Score range")
                plt.ylabel("Count")
                plt.tight_layout()
                out_path = os.path.join(out_dir, f"factor_{f}_hist.png")
                plt.savefig(out_path, dpi=150)
                plt.close()
            print(f"Saved histogram PNGs in ./{out_dir}/")

    # Print mapping summary (useful for verifying fuzzy matches)
    print("\nColumn mapping (CSV column -> canonical question [match score]):")
    for col, (q, score) in mapping.details.items():
        target_idx = mapping.col_to_idx.get(col, None)
        print(f" - {col} -> [{target_idx}] {q} [{score:.2f}]")

    if mapping.label_row_index is not None:
        print(f"\nDetected and skipped a label/question-text row at index: {mapping.label_row_index}")


if __name__ == "__main__":
    main()