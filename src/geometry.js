/**
 * Created by eason on 16-12-28.
 */
class Vec3{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec3){
        return new Vec3(
            this.x+vec3.x,
            this.y+vec3.y,
            this.z+vec3.z
        )
    }

    set(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toVec4(){
        return $V([this.x,this.y,this.z,1])
    }
}

class Vec2{
    constructor(x,y){
        this.x = Math.round(x);
        this.y = Math.round(y);
    }
}

class Face{
    constructor(vecs,color){
        this.vecs = vecs;
        this.color = color;
    }
}

module.exports = {
    Vec3 : Vec3,
    Vec2 : Vec2,
    Face : Face
};