/**
 * Created by eason on 16-12-31.
 */
let {Camera,CameraConfig} = require('./camera');

class Scence {
    constructor(){
        this.camera = new Camera(CameraConfig.build('perspective').init());
        this.light = [];
        this.objects = [];
    }

    add(something){
        switch(something.type){
            case 'camera':
                this.camera = something;
                break;
            case 'light':
                this.light.push(something);
                break;
            case 'shape':
                this.objects.push(something);
                break;
        }
    }
}

module.exports = Scence;