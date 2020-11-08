import sys
import os

f = sys.argv[1]

stream = os.popen('./runIt.sh')
output = stream.readlines()

do_sum = False
sum = 0
last_line_is_elapsed = False

for line in output:
    print(line)
    if len(line.split(" ")) > 0 and line.split(" ")[0] == "POSTING":
        do_sum = True

    if do_sum and len(line.split(" ")) > 3 and line.split(" ")[0] == "Elapsed":
        last_line_is_elapsed = True
        if last_line_is_elapsed:
            break
        sum += line.split(" ")[3]
    else:
        last_line_is_elapsed = False

print("Finished. Took: " + str(sum) + " ms")


