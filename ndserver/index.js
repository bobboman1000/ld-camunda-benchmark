const fs = require('fs');
const N3 = require('n3');
const trig_parser = new N3.Parser({ format: 'application/trig' });
var XMLWriter = require('xml-writer')


// const nquads_store = new N3.Store();
var express = require('express'),
    bodyParser = require('body-parser');

//

// express app setup
var app = express();
app.use(bodyParser.json());

// store
const filePath = process.argv[2] || './data/default.trig';
console.log('FilePath: ', filePath);
// var mockObjectsStore = [];
// if(fs.existsSync(filePath)){
//     mockObjectsStore = JSON.parse(fs.readFileSync(filePath));
// }

var json_graphs = [];
var nquads_store = new N3.Store();
if(fs.existsSync(filePath)){
    var data = fs.readFileSync(filePath, 'utf8'); 
    var quads = trig_parser.parse(data);
    nquads_store.addQuads(quads);
    nquads_store.forGraphs( graph => {
        var json_graph = {name: graph.id, subjects: []};
        nquads_store.forSubjects(subject => {
            var json_subject = {name: subject.id, properties: []};
            nquads_store.forPredicates( predicate => {
                nquads_store.forObjects(object => {
                    json_subject.properties.push({
                        predicate: predicate.id,
                        object: object.id
                    })
                 }, subject, predicate, graph);
            }, subject, null, graph);
            json_graph.subjects.push(json_subject);
        }, null, null, graph);
        json_graphs.push(json_graph);
    });
}

// ui 
app.use('/html', express.static('html'));

// 
app.get('/mock/json', (req, res) => {
    
    console.log('GET: /mock/trig');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json_graphs));
});

app.post('/mock/json', (req, res) => {

    // update 
    json_graphs = req.body;

    // convert to quads and then to trig and save
    var quads = [];
    for(var i in json_graphs){
        const json_graph = json_graphs[i];
        for(var j in json_graph.subjects){
            const json_subject = json_graph.subjects[j];
   
            for(var k in json_subject.properties){
                const json_property = json_subject.properties[k];        
                r = /^"(.*)"(@[\w]{2})?$/
                m = json_property.object.match(r);
                // literals have to be quoted in double quotes
                if(m !== null){
                    var object_value = m[1];
                    var object_value_lang = m[2] !== undefined ? m[2].slice(1) : null;             // remove leading @
                    var object;
                    // type-cases
                    if(['false', 'true'].indexOf(object_value.toLowerCase()) > -1){         // boolean
                        object =  N3.DataFactory.literal(['false', 'true'].indexOf(object_value.toLowerCase()) ? true : false)
                    }else if(!isNaN(Number(object_value))){                                 // numbers (integer and float)
                        object =  N3.DataFactory.literal(parseFloat(object_value));
                    }else{                                                                  // string
                        object = object_value_lang !== null ? N3.DataFactory.literal(object_value, object_value_lang) : N3.DataFactory.literal(object_value);
                    }
                // otherwise the object is treated as URI
                }else{
                    object = N3.DataFactory.namedNode(json_property.object);
                } 
                
                quads.push(
                    N3.DataFactory.quad(
                        N3.DataFactory.namedNode(json_subject.name),
                        N3.DataFactory.namedNode(json_property.predicate),
                        object,
                        N3.DataFactory.namedNode(json_graph.name)
                    )
                );
            }
        }
    }

    // update nquads store
    nquads_store = new N3.Store()
    nquads_store.addQuads(quads)


    console.log('POST: /mock/trig');
    console.log(json_graphs);

    // save (frite to file) 
    const n3writer = new N3.Writer();
    
    n3writer.addQuads(quads)
    n3writer.end((error, trig_string) => {
        console.log(trig_string);
        fs.writeFileSync(filePath, trig_string);
    });
    
    res.end();
});




// get mock milestone values as rdf+xml
app.get('/mock/rdf/:graph', async function(req, res){

    // get all quads for requested graph
    graphQuads = nquads_store.getQuads(null, null, null, req.params.graph)

    // serialize 
    xmlStr = await serializeN3QuadsToXml(graphQuads);

    res.writeHead(200, {'Content-Type': 'application/rdf+xml'});
    //res.writeHead(200, {'Content-Type': 'application/xml'});
    res.write(xmlStr);
    res.end();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3100, function () {
  console.log('Example app listening on port 3100!');
});


function serializeN3QuadsToXml(quads){
    return new Promise(function (resolve) {
    
        var xw = new XMLWriter()
    
        xw.startDocument(1.0, 'UTF-8')
    
        xw.startElementNS('rdf', 'RDF')
        xw.startAttributeNS('xmlns', 'rdf')
        xw.text('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
        xw.endAttribute()
    
        var separateNSandLocalName = function (iri) {
            var ret = {}
            var idx = iri.lastIndexOf('#')
            if (idx <= 0) {
            idx = iri.lastIndexOf('/')
            }
            if (idx <= 0) { /* should fail? */ }
            ret['namespace'] = iri.substring(0, idx + 1)
            ret['localname'] = iri.substring(idx + 1, iri.length)
            ret['prefix'] = 'ns' + Math.floor(Math.random() * 99999)
            return ret
        }
    
        for(var i in quads){
            var quad = quads[i];

            // triple
            xw.startElementNS('rdf', 'Description')
    
            // subject
            if (quad.subject.constructor.name === 'BlankNode') {
            xw.startAttributeNS('rdf', 'nodeID')
            } else if (quad.subject.constructor.name === 'NamedNode') {
            xw.startAttributeNS('rdf', 'about')
            } else { /* fail */ }
            //xw.text(triple.subject.nominalValue)
            xw.text(quad.subject.value)
            xw.endAttribute()
    
            // predicate
            var parts = separateNSandLocalName(quad.predicate.value)
            xw.startElementNS(parts['prefix'], parts['localname'])
            xw.startAttributeNS('xmlns', parts['prefix'])
            xw.text(parts['namespace'])
            xw.endAttribute()
    
            // object
            if (quad.object.constructor.name === 'BlankNode') {
            xw.startAttributeNS('rdf', 'nodeID')
            } else if (quad.object.constructor.name === 'NamedNode') {
            xw.startAttributeNS('rdf', 'resource')
            } else {
            if (quad.object.language) {
                xw.startAttributeNS('xml', 'lang')
                xw.text(quad.object.language)
                xw.endAttribute()
            } else if (quad.object.datatype &&
                quad.object.datatype.value !==
                    'http://www.w3.org/2001/XMLSchema#string') {
                xw.startAttributeNS('rdf', 'datatype')
                xw.text(quad.object.datatype.value)
                xw.endAttribute()
            }
            }
            xw.text(quad.object.value.toString())
            xw.endElement()
    
            // end triple
            xw.endElement()
        }
    
        // end graph
        xw.endDocument()
    
        var xmlString = xw.toString()
    
        resolve(xmlString)
    })
}


// get mock milestone values as rdf+xml
app.get('/legacy/rdf/:graph', function(req, res){


    var xmlStr = '<?xml version="1.0" encoding="utf-8" ?>';
    xmlStr += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:ns0="http://example.org/">';

    var json_graph = json_graphs.filter( o => {
        return o.name == req.params.graph
    })[0] || null;
    
    if(!json_graph)
        res.end("graph not found.");

    var mockObjectsStore = json_graph.subjects;

    for(var i in mockObjectsStore){
        const mockObject = mockObjectsStore[i];

        xmlStr += '<rdf:Description rdf:about="#'+mockObject.name+'">';

        // properties (predicate object pairs)
        for(var j in mockObject.properties){
            const property = mockObject.properties[j];


            // detect datatype by value (object)
            var dataType, objectValue;

            console.log('pobj: ', property.object);

            if(/^\d+$/.test(property.object)){
                dataType = 'integer';
                objectValue = property.object;
            }else if(/^(true|false)$/.test(property.object)){
                dataType = 'boolean';
                objectValue = property.object;
            }else if(/^"(.*)"$/.test(property.object)){
                dataType = 'string';
                objectValue = property.object.slice(1, -1);
            }else if(property.object.substring(0, 1) == ':'){
                // TODO: rather differ between data and ressource that using ressource as data type
                dataType = 'ressource';
                objectValue = property.object.slice(1);
            }else{
                dataType = 'string';
                objectValue = property.object;
            }
            
            if(dataType == 'ressource'){
                xmlStr += '<ns0:'+property.predicate+' rdf:ressource="#'+objectValue+'" />';
            }else{
                xmlStr += '<ns0:'+property.predicate+' rdf:datatype="http://www.w3.org/2001/XMLSchema#'+dataType+'">';
                xmlStr += objectValue;
                xmlStr += '</ns0:'+property.predicate+'>';
            }

           

        }

        xmlStr += '</rdf:Description>';
    }

    xmlStr += '</rdf:RDF>';

    //res.writeHead(200, {'Content-Type': 'application/rdf+xml'});
    res.writeHead(200, {'Content-Type': 'application/xml'});
    res.write(xmlStr);
    res.end();
});