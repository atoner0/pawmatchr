# matplotlib histogram formatting based on DelftStack tutorial:
# How to Plot Two Histograms Together in Matplotlib
# Available at: https://www.delftstack.com/howto/matplotlib/how-to-plot-two-histograms-in-one-plot-in-matplotlib/

import matplotlib.pyplot as plt
import numpy as np

run_1 = np.array([0.936, 1, 0.426, 0.794, 1, 0.402, 0.723, 1, 0.893, 0.787])
run_2 = np.array([0.613, 0.855, 0.188, 0.495, 0.681, 0.169, 0.436, 0.677, 0.578, 0.489])
run_3 = np.array([0.67, 1, 0.032, 0.493, 0.772, 0.003, 0.404, 0.766, 0.616, 0.484])

bins = np.linspace(0, 1, 11)

fig, axs = plt.subplots(1, 3, sharey=True, tight_layout=True)

axs[0].hist(run_1, bins, alpha=0.7, color="blue", edgecolor="black", linestyle=":")
axs[0].set_title("Run 1 (0.1-0.6)")

axs[1].hist(run_2, bins, alpha=0.7, color="orange", edgecolor="black", linestyle=":")
axs[1].set_title("Run 2 (0.2-0.8)")

axs[2].hist(run_3, bins, alpha=0.7, color="green", edgecolor="black", linestyle=":")
axs[2].set_title("Run 3 (0.3-0.7)")

plt.show()