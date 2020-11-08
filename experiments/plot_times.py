import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt

times = pd.read_csv("times.csv", index_col=-1, sep=";")

ax = sns.boxplot(x="no_wfs", y="time", hue="Method", data=times, palette="Set3")

plt.xlabel("Number of workflow instances")
plt.ylabel("Time taken in ms")

plt.savefig("boxplot.pdf", bbox_inches='tight')
plt.show()
