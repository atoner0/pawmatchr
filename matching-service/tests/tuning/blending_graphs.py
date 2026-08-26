# matplotlib histogram formatting based on DelftStack tutorial:
# How to Plot Two Histograms Together in Matplotlib
# Available at: https://www.delftstack.com/howto/matplotlib/how-to-plot-two-histograms-in-one-plot-in-matplotlib/

import matplotlib.pyplot as plt
import numpy as np

run_1 = np.array([0.884, 0.901, 0.53, 0.825, 0.878, 0.543, 0.776, 0.837, 0.352, 0.209])
run_2 = np.array([0.845, 0.895, 0.481, 0.778, 0.85, 0.49, 0.728, 0.814, 0.385, 0.249])
run_3 = np.array([0.923, 0.908, 0.579, 0.872, 0.907, 0.597, 0.825, 0.859, 0.32, 0.169])

bins = np.linspace(0, 1, 11)

fig, axs = plt.subplots(1, 3, sharey=True, tight_layout=True)

axs[0].hist(run_1, bins, alpha=0.7, color="blue", edgecolor="black", linestyle=":")
axs[0].set_title("Run 1 (70/30)")

axs[1].hist(run_2, bins, alpha=0.7, color="orange", edgecolor="black", linestyle=":")
axs[1].set_title("Run 2 (60/40)")

axs[2].hist(run_3, bins, alpha=0.7, color="green", edgecolor="black", linestyle=":")
axs[2].set_title("Run 3 (80/20)")

plt.tight_layout()

plt.show()