const fs= require('fs');

const N3 = require('n3');
const nquads_store = new N3.Store();
const n3writer = new N3.Writer();


var json_graphs = JSON.parse(fs.readFileSync('./data/test.json', 'utf8')); 

var quads = [];

if(true){
for(var i in json_graphs){
    const json_graph = json_graphs[i];

    for(var j in json_graph.subjects){
        const json_subject = json_graph.subjects[j];


        for(var k in json_subject.properties){
            const json_property = json_subject.properties[k];

            console.log('property: ', json_property);

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

            

            //
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
}

nquads_store.addQuads(quads);

const myQuad = N3.DataFactory.quad(
    N3.DataFactory.namedNode('https://ruben.verborgh.org/profile/#me'),
    N3.DataFactory.namedNode('http://xmlns.com/foaf/0.1/givenName'),
    N3.DataFactory.literal(null),
    N3.DataFactory.defaultGraph(),
);

console.log(nquads_store);

n3writer.addQuads(quads)
n3writer.end((error, trig_string) => {
    fs.writeFileSync('./data/test.json.trig', trig_string);
});