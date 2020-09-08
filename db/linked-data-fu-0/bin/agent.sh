#!/bin/bash
while true; do
./ldfu.sh -i spam409600.ttl -q spo.rq output.tsv
awk -f ./turn-tsv-into-sql.skript output.tsv > cmds.sql 
java -cp "./h2-1.4.190.jar" org.h2.tools.RunScript -url "jdbc:h2:file:../../../camunda/camunda-h2-database;AUTO_SERVER=TRUE" -script cmds.sql -user sa
curl http://localhost:8080/update 1>&2
done
