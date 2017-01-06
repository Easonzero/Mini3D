/**
 * Created by eason on 16-12-31.
 */
let {Vec3} = require('./geometry');
let Transformable = require('./transformable');

class Camera extends Transformable{
    constructor(){
        super();
        this.type = 'camera';
        this.position = new Vec3(0,0,-100);
        this.dir = new Vec3(0,0,1);
    }

    update(){
        let w = new Vec3(this.dir.x,this.dir.y,this.dir.z).normalize(-1);
        let u = new Vec3(0,1,0).cross(w).normalize();
        let v = w.cross(u);
        let r = $M([
            [u.x,u.y,u.z,0],
            [v.x,v.y,v.z,0],
            [w.x,w.y,w.z,0],
            [0     ,     0,     0,1]
        ]);

        let t = $M([
            [1,0,0,-this.position.x],
            [0,1,0,-this.position.y],
            [0,0,1,-this.position.z],
            [0,0,0,               1]
        ]);
        this.M = this.projection.x(r).x(t);
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

class PerspectiveCamera extends Camera{
    constructor(deg=90,r=1,n=50,f=100){
        super();
        let tan = Math.tan(deg*Math.PI/360);
        let tann = tan*n;

        this.project(-tann,tann,-tann*r,tann*r,n,f);
    }

    project(l=-1,r=1,b=-1,t=1,n=1,f=100){
        this.projection = $M([
            [2*n,              0,(l+r)/(l-r),          0],
            [  0,2*n*(t-b)/(r-l),(t+b)/(t-b),          0],
            [  0,              0,(f+n)/(n-f),f*n*2/(f-n)],
            [  0,              0,          1,          0]
        ]);
        this.update();
    }
}

class OrthophotoCamera extends Camera{
    constructor(deg,r,n,f){
        super();

        this.project();
    }

    project(l=-1,r=1,b=-1,t=1,n=1,f=100){
        this.projection = $M([
            [2/(r-l),      0,      0,-(l+r)/2],
            [      0,2/(t-b),      0,-(t+b)/2],
            [      0,      0,2/(n-f),-(n+f)/2],
            [      0,      0,      0,       1]
        ]);
        this.update();
    }
}

module.exports = {
    PerspectiveCamera : PerspectiveCamera,
    OrthophotoCamera : OrthophotoCamera
};