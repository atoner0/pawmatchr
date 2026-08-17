# matplotlib histogram formatting based on DelftStack tutorial:
# How to Plot Two Histograms Together in Matplotlib
# Available at: https://www.delftstack.com/howto/matplotlib/how-to-plot-two-histograms-in-one-plot-in-matplotlib/

import matplotlib.pyplot as plt
import numpy as np

run_1 = np.array([0.936, 1, 0.426, 0.794, 1, 0.402, 0.723, 1, 0.893, 0.787])
run_2 = np.array([0.613, 0.855, 0.188, 0.495, 0.681, 0.169, 0.436, 0.677, 0.578, 0.489])

bins = np.linspace(0, 1, 11)

plt.hist(run_1, bins=20, alpha=0.5, label="run 1 (0.1-0.6)")
plt.hist(run_2, bins=20, alpha=0.5, label="run 2 (0.2-0.8)")
plt.legend(loc="upper left")
plt.title("Histograms of Scaled Scores")
plt.show()