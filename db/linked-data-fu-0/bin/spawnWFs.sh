for i in {1..100}
do
  curl -X POST -H "Content-Type: application/json" -d '{"businessKey":"wf$i"}' http://localhost:8080/rest/process-definition/key/Process_037oc1x/start
done
