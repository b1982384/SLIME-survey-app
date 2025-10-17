import pandas as pd
import matplotlib.pyplot as plt
import os
import numpy as np 

CSV_PATH = "/Users/benwong-fodor/Desktop/R/dist_char/factor_scores.csv"
OUTPUT_DIR = "/Users/benwong-fodor/Desktop/R/dist_char/factor_lines_10"
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)
factor_columns = [f"factor_{i}" for i in range(1, 9)]
bin_edges = np.array([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
#[0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]

for col in factor_columns:
    counts, _ = np.histogram(df[col], bins=bin_edges)
    # Calculate bin centers for the x-axis
    bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2
    plt.figure(figsize=(6, 4))
    plt.plot(bin_centers, counts, marker='o', color="#3b82f6", linewidth=2)
    plt.title(f"{col.replace('_', ' ').capitalize()} Frequency Plot")
    plt.xlabel("Normalized Score (0 to 1)")
    plt.ylabel("Number of Respondents")
    plt.xticks(bin_edges)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig(f"{OUTPUT_DIR}/{col}_freq_line.png", dpi=150)
    plt.close()

print(f"Saved 8 frequency line plots to folder: {OUTPUT_DIR}")