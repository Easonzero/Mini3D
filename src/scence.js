/**
 * Created by eason on 16-12-31.
 */
let {PerspectiveCamera} = require('./camera');
let {AmbientLight} = require('./light');

class Scence {
    constructor(){
        this.camera = new PerspectiveCamera();
        this.lights = [new AmbientLight()];
        this.objects = [];
    }

    add(something){
        switch(something.type){
            case 'camera':
                this.camera = something;
                break;
            case 'direct-light':
            case 'point-light':
            case 'ambient-light':
                this.lights.push(something);
                break;
            case 'shape':
                this.objects.push(something);
                break;
        }
    }
}

module.exports = Scence;