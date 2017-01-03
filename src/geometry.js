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

    substact(vec3){
        return new Vec3(
            this.x-vec3.x,
            this.y-vec3.y,
            this.z-vec3.z
        )
    }

    cross(vec3){
        return new Vec3(
            this.y*vec3.z-vec3.y*this.z,
            -this.x*vec3.z+vec3.x*this.z,
            this.x*vec3.y-vec3.x*this.y
        )
    }

    dot(vec3){
        return this.x*vec3.x+this.y*vec3.y+this.z*vec3.z;
    }

    multi(num){
        return new Vec3(
            this.x*num,
            this.y*num,
            this.z*num
        )
    }

    normalize(c=1){
        let l = Math.hypot(this.x,this.y,this.z)/c;
        this.x /= l;
        this.y /= l;
        this.z /= l;

        return this;
    }

    set(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    toVec4(c=1){
        return $V([this.x,this.y,this.z,c])
    }
}

class Face{
    constructor(vecs,color){
        this.vecs = vecs;
        this.color = color;
        this.normal = vecs[1].substact(vecs[0]).cross(vecs[2].substact(vecs[1])).normalize(-1);
    }
}

module.exports = {
    Vec3 : Vec3,
    Face : Face
};