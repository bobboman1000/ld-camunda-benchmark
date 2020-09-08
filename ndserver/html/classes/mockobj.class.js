
class Mockobj{

    // variables
    _dom = {};
    _name = 'mockobj';
    _properties = [];
    _events = {};

    // construct
    constructor(){
        this._name = 'mockobj' + $('.mockobj-tile').length;
    }

    _build(){
        var me = this;

        // 
        this._dom = {};

        //
        this._nr = $('.mockobj-tile').length;
        this._id = $('.mockobj-tile').length;

        // tile
        var $tile = this._dom.$tile = $('<div class="mockobj-tile"></div>')
            .attr('data-mockobj-id', this._id)
            .on('click', (e) => {
                if(!$(e.currentTarget).find('.mockobj-property').length){
                    this.addProperty('new', 'new');
                    this._buildProperties();
                }
            });

        // name
        this._dom.$nameInput = $('<input type="text" pattern="[A-Za-z]+"/>')
            .val(this._name)
            .on('change', (ev, el) => {
                me.name =  this._dom.$nameInput.val();
            })
            .appendTo($tile);

        // properties
        this._buildProperties();

        // delete icon
        var $cmdDelete = $('<div class="mockobj-cmdRemove">x</div>')
            .on('click', () => {
                this._triggerEvent('remove');
                this._dom.$tile.remove();
            })
            .appendTo($tile);
    }

    get id(){
        return this._id;
    }

    get dom(){
        return this._dom.$tile;
    }

    _buildProperties(){

        var $ps;

        if(!this._dom.$properties){
            $ps = this._dom.$properties = $('<div class="mockobj-properties"></div>').appendTo(this._dom.$tile);
        }else{
            $ps = this._dom.$properties.html(''); 
        }
         

        for(var i in this._properties){
            var property = this._properties[i];
            var $p = $('<div class="mockobj-property"></div>').appendTo($ps);
           
            var $pred = $('<p class="mockobj-property-pred" contenteditable="true"></p>')
                .text(property.predicate)
                .attr('data-property-i', i)
                .on('input', (e) => {
                    var i = parseInt(e.target.dataset.propertyI),
                        v = e.target.innerHTML,
                        p = this.getProperty(i);
                    p.predicate = v;
                    this.setProperty(i, p);
                    this._triggerEvent('change');
                })
                .on('keydown', (e) => {
                    if(e.keyCode == 13 || e.keyCode == 39 || e.keyCode == 9){
                        ceelemselect($(e.target).next('p'));
                        e.preventDefault();
                    }else if(e.keyCode == 37){
                        ceelemselect($(e.target).parent().prev().children('p').last());
                        e.preventDefault();
                    }else if(e.keyCode == 8){
                        var $target = $(e.target);
                        if($(e.target).html() + $(e.target).next().html() == ''){
                            var i = parseInt($(e.target).attr('data-property-i'));
                            this.removeProperty(i);
                            this._triggerEvent('change');
                            ceelemselect($(e.target).parent().prev().children('p').last());
                            $(e.target).parent().remove();
                            e.preventDefault();
                        }
                    }
                })
                .appendTo($p);
           
                var $obj = $('<p class="mockobj-property-obj" contenteditable="true"></p>')
                .text(property.object)
                .attr('data-property-i', i)
                .on('input', (e) => {
                    var i = parseInt(e.target.dataset.propertyI),
                        v = e.target.innerHTML,
                        p = this.getProperty(i);
                    p.object = v;
                    this.setProperty(i, p);
                    this._triggerEvent('change');
                })
                .on('keydown', (e) => {
                    if(e.keyCode == 13 || e.keyCode == 39 || e.keyCode == 9){
                        var $elm = $(e.target).parent().next().children('p').eq(0);
                        if($elm.length){
                            ceelemselect($elm);
                        }else{
                            this.addProperty('new', 'new');
                            this._triggerEvent('change');
                            this._buildProperties();

                            // hacky
                            $elm = $ps.children('div').last().children('p').first();
                            ceelemselect($elm);
                            
                        }
                        e.preventDefault();
                    }else if(e.keyCode == 37 || (e.keyCode == 8 && e.target.innerHTML == '')){
                        ceelemselect($(e.target).prev());
                        e.preventDefault();
                    }
                })
                .appendTo($p);
        }
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
        }else{
            console.error('not matching name: ', name);
        }

        if(this._dom.$nameInput)
            this._dom.$nameInput.val(this._name);
    }

    // for predicate object pairs
    addProperty(predicate, object){
        this._properties.push({
            predicate: predicate,
            object: object
        });
    }

    removeProperty(i){
        this._properties.splice(i, 1);
    }

    removeAllProperties(){
        this._properties = [];
    }

    setProperty(i, property){
        this._properties[i] = property;
    }

    getProperty(i){
        return this._properties[i];
    }

    getProperties(){
        return this._properties;
    }


    toJSON(){
        return {
            //id: this._id,
            name: this._name,
            properties: this._properties
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