/**
 * Created by eason on 16-12-31.
 */
let Transformable = require('./transformable');

class PointLight extends Transformable{
    constructor(color=0xffffff,pos){
        super();
        this.type='point-light';

        this.c = color/0xffffff;
        this.position = pos;
    }

    cal(n){

    }
}

class DirectLight extends Transformable{
    constructor(color=0xffffff,cl=0.7,dir){
        super();
        this.type='direct-light';

        this.c = color/0xffffff;
        this.cl = cl;
        this.dir = dir.normalize();
    }

    cal(n){
        return this.c*this.cl*Math.abs(n.dot(this.dir.toVec4())-1);
    }
}

class AmbientLight extends Transformable{
    constructor(color=0xffffff,ca=0.3){
        super();
        this.type='ambient-light';

        this.c = color/0xffffff;
        this.ca = ca;
    }

    cal(n){
        return this.c*this.ca;
    }
}

module.exports = {
    AmbientLight:AmbientLight,
    DirectLight:DirectLight,
    PointLight:PointLight
};