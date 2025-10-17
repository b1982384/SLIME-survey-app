import pandas as pd
import matplotlib.pyplot as plt
import os

# Path to your CSV file
CSV_PATH = "/Users/benwong-fodor/Desktop/R/dist_char/factor_scores.csv"
# Output directory for plots
OUTPUT_DIR = "/Users/benwong-fodor/Desktop/R/dist_char/HISTOGRAMS"
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)
factor_columns = [f"factor_{i}" for i in range(1, 9)]

for col in factor_columns:
    plt.figure(figsize=(6, 4))
    plt.hist(df[col], bins=[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], color="#3b82f6", edgecolor="black", alpha=0.8)
    plt.title(f"Distribution for {col.replace('_', ' ').capitalize()}")
    plt.xlabel("Normalized Score (0 to 1)")
    plt.ylabel("Number of Respondents")
    plt.xlim(0, 1)
    plt.ylim(0, None)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig(f"{OUTPUT_DIR}/{col}_hist.png", dpi=150)
    plt.close()

print(f"Saved 8 histograms to folder: {OUTPUT_DIR}")


#[0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]