
const fs= require('fs');
const N3 = require('n3');
const trig_parser = new N3.Parser({ format: 'application/trig' });
const nquads_store = new N3.Store();

var data = fs.readFileSync('./test.json.trig', 'utf8'); 
var quads = trig_parser.parse(data);
nquads_store.addQuads(quads);



// nquads_store.forSubjects((subject) => {
//     console.log('Subject: ', subject);
// }, null, null, 'Lighting_1F_M38');

console.log(quads)

/**************************************/
/**************************************/

var express = require('express');
var bodyParser = require('body-parser');
var rdf = require('rdf-ext')
var rdfBodyParser = require('rdf-body-parser');
var RdfXmlSerializer = require('../rdf-serializer-rdfxml/index.js');

app = express();

var formatparams = {};
formatparams.serializers = new rdf.Serializers();
formatparams.serializers['application/rdf+xml'] = RdfXmlSerializer;
var formats = require('rdf-formats-common')(formatparams);

var configuredBodyParser = rdfBodyParser({'defaultMediaType' : 'text/turtle', 'formats' : formats});

app.use(configuredBodyParser);


app.get('/mock/rdf/:graph', async function(req, res){

    var myGraph = rdf.graph(quads);

   //console.log(RdfXmlSerializer);


    xml = await RdfXmlSerializer.serialize(myGraph);
    console.log(xml);

    console.log('------- MY Graph -----');
    console.log(myGraph);

    res.writeHead(200, {'Content-Type': 'text/turtle'});
    res.sendGraph(myGraph);
    res.end();
});

// Startup the server
var port = 3300;
app.listen(port, function () {
  console.log('Tessel2 LED REST app listening on port ' + port);
});

/**************************************/

