import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import os

r_state = np.random.RandomState(1234)

times100 = pd.read_csv("results/times100.csv", index_col=0).sample(20, random_state=r_state)

times200 = pd.read_csv("results/times200.csv", index_col=0).sample(20, random_state=r_state)

times400 = pd.read_csv("results/times400.csv", index_col=0).sample(20, random_state=r_state)

times800 = pd.read_csv("results/times800.csv", index_col=0).sample(20, random_state=r_state)

times1600 = pd.read_csv("results/times1600.csv", index_col=0).sample(20, random_state=r_state)

times3200 = pd.read_csv("results/times3200.csv", index_col=0).sample(20, random_state=r_state)

times6400 = pd.read_csv("results/times6400.csv", index_col=0).sample(20, random_state=r_state)

times12800 = pd.read_csv("results/times12800.csv", index_col=0).sample(20, random_state=r_state)

times25600 = pd.read_csv("results/times25600.csv", index_col=0).sample(20, random_state=r_state)

times51200 = pd.read_csv("results/times51200.csv", index_col=0).sample(20, random_state=r_state)

times102400 = pd.read_csv("results/times102400.csv", index_col=0).sample(20, random_state=r_state)

times204800 = pd.read_csv("results/times204800.csv", index_col=0).sample(20, random_state=r_state)

times409600 = pd.read_csv("results/times409600.csv", index_col=0).sample(20, random_state=r_state)

results = [times100, times200, times400, times800, times1600, times3200, times6400, times12800,
           times25600, times51200, times102400, times204800, times409600]

setup = np.asarray(list(map(lambda x: np.mean(x.loc[:,"setup_ms"]), results)))
setup_std = np.asarray(list(map(lambda x: np.std(x.loc[:,"setup_ms"]), results)))
elapsed = np.asarray(list(map(lambda x: np.mean(x.loc[:,"elapsed_ms"]), results)))
elapsed_std = np.asarray(list(map(lambda x: np.std(x.loc[:,"elapsed_ms"]), results)))
dbRead_ms = np.asarray(list(map(lambda x: np.mean(x.loc[:,"dbRead_ms"]), results)))
dbRead_ms_std = np.asarray(list(map(lambda x: np.std(x.loc[:,"dbRead_ms"]), results)))

all = np.add(np.add(setup, elapsed), dbRead_ms)
all_std = np.add(np.add(setup_std, elapsed_std), dbRead_ms_std)

db_wo = np.add(setup, elapsed)
db_wo_std = np.add(setup_std, elapsed_std)

x_ticks = np.logspace(0, 12, 13, base=2) * 10

fig, ax = plt.subplots()
ax.plot(x_ticks, setup, color="red", linestyle='dashed', label='Setup time')
ax.fill_between(x=x_ticks, y1=np.add(setup, setup_std), y2=np.add(setup, -setup_std), color="r", alpha=0.1)

ax.plot(x_ticks, elapsed, color="steelblue", linestyle='dashed', label='Elapsed time')
ax.fill_between(x=x_ticks, y1=np.add(elapsed, elapsed_std), y2=np.add(elapsed, -elapsed_std), color="steelblue", alpha=0.1)

ax.plot(x_ticks, dbRead_ms, color="darkgreen", linestyle='dashed', label='Read DB time')
ax.fill_between(x=x_ticks, y1=np.add(dbRead_ms, dbRead_ms_std), y2=np.add(dbRead_ms, -dbRead_ms_std), color="g", alpha=0.1)


ax.plot(x_ticks, all, color="midnightblue", linestyle='-', label="Total time")
ax.fill_between(x=x_ticks, y1=np.add(all, all_std), y2=np.add(all, -all_std), color="midnightblue", alpha=0.1)

ax.plot(x_ticks, db_wo, color="darkred", linestyle='-', label="Total time without db reading")
ax.fill_between(x=x_ticks, y1=np.add(db_wo, db_wo_std), y2=np.add(db_wo, -db_wo_std), color="darkred", alpha=0.1)

ax.set_xlabel("Number of written triples")
ax.set_ylabel("ms")
ax.legend()
plt.savefig(fname="db_times.pdf", bbox_inches='tight')
plt.show()