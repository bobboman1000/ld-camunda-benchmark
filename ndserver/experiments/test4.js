var XMLWriter = require('xml-writer')

const fs= require('fs');
const N3 = require('n3');
const trig_parser = new N3.Parser({ format: 'application/trig' });
const nquads_store = new N3.Store();

var data = fs.readFileSync('./test.json.trig', 'utf8'); 
var quads = trig_parser.parse(data);
nquads_store.addQuads(quads);

graph = 'Lighting_1F_M38'
graphQuads = nquads_store.getQuads(null, null, null, graph)

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


serializeN3QuadsToXml(graphQuads).then((xml) => console.log(xml));