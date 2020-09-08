
class MockGraph{

    // variables
    _dom = {};
    _name = 'mockgraph';
    _mockobjects = [];      // don't get confused future reader, those are basically rdf subjects ;) 
    _events = {};

    // construct
    constructor(name){
        this.name = name;
    }

    _build(){

    }

    get id(){
        return null;
    }

    get dom(){
        return null;
    }

    _buildMockObjects(){

    }

    _triggerEvent(eventName, data){
        if(eventName in  this._events){
            this._events[eventName](this, data);
        }
    }

    onChange(callback){
        if(callback === null) this._events['change'] = null;
        if(typeof callback != 'function') return;
        this._events['change'] = callback;
    }

    onRemove(callback){
        if(callback === null) this._events['remove'] = null;
        if(typeof callback != 'function') return;
        this._events['remove'] = callback;
    }

    get name(){
        return this._name;
    }

    set name(name){
        var r = new RegExp("^[A-Za-z0-9\\/\\:\\.\\-\\+\\?\\#\\_]+$");
        if(r.test(name)){ 
            this._name = name;
            this._triggerEvent('change');
        }
        if(this._dom.$nameInput)
            this._dom.$nameInput.val(this._name);
    }

    // for predicate object pairs
    addMockObject(mockObject){
        this._mockobjects.push(mockObject);
    }

    removeMockObject(mockObject){
        this._mockobjects =  this._mockobjects.filter(function( o ) {
            return o.name !== mockObject.name;
        });
    }

    getMockObjects(){
        return this._mockobjects;
    }

    toJSON(){

        var subjects = []
        for(var i in this._mockobjects){
            subjects.push(this._mockobjects[i].toJSON());
        }

        return {
            //id: this._id,
            name: this._name,
            subjects: subjects
        };
    }

}

function ceelemselect($elm){
    if(!$elm.length) return;
    var selection = window.getSelection();        
    var range = document.createRange();
    range.selectNodeContents($elm.get(0));
    selection.removeAllRanges();
    selection.addRange(range);
}