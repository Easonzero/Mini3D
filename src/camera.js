/**
 * Created by eason on 16-12-31.
 */
let {Vec3} = require('./geometry');
let {Perspective,Orthophoto} = require('./camera/index');
let Transformable = require('./transformable');

class CameraConfig{
    static build(type){
        switch (type.toUpperCase()){
            case 'PERSPECTIVE':
                return new Perspective();
            case 'ORTHOPHOTO':
                return new Orthophoto();
        }
    }
}

class Camera extends Transformable{
    constructor(config){
        super();
        this.type = 'camera';
        this.position = new Vec3(0,0,-50);
        this.dir = new Vec3(0,0,1);

        this.config = config;

        this.update();
    }

    update(){
        let w = $V([this.dir.x,this.dir.y,this.dir.z]).x(-1/Math.hypot(this.dir.x,this.dir.y,this.dir.z));
        let u = $V([0,1,0]).cross(w);
        u = u.x(1/Math.hypot(u.e(1),u.e(2),u.e(3)));
        let v = w.cross(u);
        let r = $M([
            [u.e(1),u.e(2),u.e(3),0],
            [v.e(1),v.e(2),v.e(3),0],
            [w.e(1),w.e(2),w.e(3),0],
            [0     ,     0,     0,1]
        ]);

        let t = $M([
            [1,0,0,-this.position.x],
            [0,1,0,-this.position.y],
            [0,0,1,-this.position.z],
            [0,0,0,               1]
        ]);
        this.M = this.config.x(r).x(t);
    }

    lookAt(aim){
        this.dir.x = aim.x - this.position.x;
        this.dir.y = aim.y - this.position.y;
        this.dir.z = aim.z - this.position.z;

        this.update();
    }

    lookBy(dir){
        this.dir = dir;

        this.update();
    }
}

module.exports = {
    CameraConfig : CameraConfig,
    Camera : Camera
};