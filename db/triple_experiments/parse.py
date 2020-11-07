import fileinput
import pandas as pd

single_times = []
all_times = []
for line in fileinput.input():
    words = line.split(" ")
    for word_idx in range(len(words)):
        if words[word_idx] == "ms," or words[word_idx] == "ms,\n":
            assert word_idx > 0
            time: str = words[word_idx - 1]
            time = time.replace(",", "")
            single_times.append(time)
            if len(single_times) == 3:
                all_times.append(single_times)
                single_times = []

pd.DataFrame(all_times, columns=["setup_ms", "elapsed_ms", "dbRead_ms"]).to_csv("times.csv")




