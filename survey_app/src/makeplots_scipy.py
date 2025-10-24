import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
from scipy.interpolate import make_interp_spline

CSV_PATH = "/Users/benwong-fodor/Desktop/R/dist_char/factor_scores.csv"
OUTPUT_DIR = "/Users/benwong-fodor/Desktop/R/dist_char/factor_lineplots_smooth"
os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)
factor_columns = [f"factor_{i}" for i in range(1, 9)]
bin_edges = np.linspace(0, 1.0, 21)  # 20 bins

for col in factor_columns:
    counts, _ = np.histogram(df[col], bins=bin_edges)
    bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2

    # Smooth the line using cubic spline
    xnew = np.linspace(bin_centers[0], bin_centers[-1], 200)
    spline = make_interp_spline(bin_centers, counts, k=3)
    y_smooth = spline(xnew)

    plt.figure(figsize=(6, 4))
    plt.plot(xnew, y_smooth, color="#3b82f6", linewidth=2)
    plt.scatter(bin_centers, counts, color="#3b82f6")
    plt.title(f"{col.replace('_', ' ').capitalize()} Frequency Plot (Smooth)")
    plt.xlabel("Normalized Score (0 to 1)")
    plt.ylabel("Number of Respondents")
    plt.xlim(0, 1)
    plt.xticks(np.linspace(0, 1, 6))
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig(f"{OUTPUT_DIR}/{col}_freq_line_smooth.png", dpi=150)
    plt.close()

print(f"Saved 8 smooth frequency line plots to folder: {OUTPUT_DIR}")