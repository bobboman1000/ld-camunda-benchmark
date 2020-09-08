echo "@prefix mock: <http://localhost:8080/mock/rdf/test> .\n" > spam$1.ttl

N=$1
for ((i = 0 ; i <= $N ; i++)); do
	echo "mock:subject$i" >> spam$1.ttl
  echo "mock:predicate$i" >> spam$1.ttl
  echo "mock:object$i .\n" >> spam$1.ttl
done



