import sys 
import re

file_list = sys.argv[1].split(',')

start = ""
end = ""

outfile = open("times.csv", "w+")
outfile.write("start, end, name\n")

for f in file_list:
    filename = f.split("/")[-1]
    lines = open(f, "r").readlines()
    for line in lines:
        words = line.split(" ")
        guard = words[43] if len(words) > 43 else ""
        time = words[1] if len(words) > 1 else ""
        if re.match("g[0-9]", guard):
            if start == "":
                start = time
            end = time
    outfile.write(start + "," + end + "," + filename + "\n")





