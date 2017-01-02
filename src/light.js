/**
 * Created by eason on 16-12-31.
 */
let Transformable = require('./transformable');

class PointLight extends Transformable{
    constructor(){
        super();
        this.type='point-light'
    }

    cal(color,n){

    }
}

class DirectLight extends Transformable{
    constructor(cl=0.7,dir){
        super();
        this.type='direct-light';

        this.cl = cl;
        this.dir = dir.normalize();
    }

    cal(color,n){
        return color.multi(this.cl*Math.abs(n.dot(this.dir.toVec4())-1));
    }
}

class AmbientLight extends Transformable{
    constructor(ca=0.3){
        super();
        this.type='ambient-light';

        this.ca = ca;
    }

    cal(color,n){
        return color.multi(this.ca);
    }
}

module.exports = {
    AmbientLight:AmbientLight,
    DirectLight:DirectLight,
    PointLight:PointLight
};