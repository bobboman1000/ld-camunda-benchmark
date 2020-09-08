const fs= require('fs');

const N3 = require('n3');
const trig_parser = new N3.Parser({ format: 'application/trig' });
const nquads_store = new N3.Store();

var data = fs.readFileSync('./data/test.json.trig', 'utf8'); 
var quads = trig_parser.parse(data);
nquads_store.addQuads(quads);

var graphs = nquads_store.getGraphs();

console.log('graphs: ', graphs)

var json = [];

nquads_store.forGraphs( graph => {
    
    var json_graph = {
        name: graph.id,
        subjects: []
    };

    //var triples = store.getQuads(null, null, null, graph);
    //console.log('triples: ', triples)

    console.log('GRAPH: ', graph.id);

    //
    nquads_store.forSubjects(subject => {

        var json_subject = {
            name: subject.id,
            properties: []
        };

        console.log('SUBJECT: ', subject.id);
        
        nquads_store.forPredicates( predicate => {

            console.log('PREDICATE: ', predicate.id);

            nquads_store.forObjects(object => {
                 console.log('object: ',object);       
                 
                json_subject.properties.push({
                    predicate: predicate.id,
                    object: object.id
                })

             }, subject, predicate, graph);

        }, subject, null, graph);

        json_graph.subjects.push(json_subject);

    }, null, null, graph);
   
    
    json.push(json_graph);

});

console.log(JSON.stringify(json));