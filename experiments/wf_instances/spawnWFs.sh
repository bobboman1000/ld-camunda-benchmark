for i in {1..9}
do
  curl -X POST -H "Content-Type: application/json" -d '{"businessKey":"wf$i"}' http://localhost:9090/engine-rest/process-definition/key/Process_037oc1x/start
done
