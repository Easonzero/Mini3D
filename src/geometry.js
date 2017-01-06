/**
 * Created by eason on 16-12-28.
 */
function convertRad(deg){
    return deg*Math.PI/180;
}

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

    divide(num){
        return new Vec3(
            this.x/num,
            this.y/num,
            this.z/num
        )
    }

    normalize(c=1){
        let l = Math.hypot(this.x,this.y,this.z)/c;
        this.x /= l;
        this.y /= l;
        this.z /= l;

        return this;
    }

    rotX(deg){
        let rad = convertRad(deg),_y = this.y;
        this.y = Math.cos(rad)*this.y-Math.sin(rad)*this.z;
        this.z = Math.sin(rad)*_y+Math.cos(rad)*this.z;
        return this;
    }

    rotY(deg){
        let rad = convertRad(deg),_x=this.x;
        this.x = Math.cos(rad)*this.x+Math.sin(rad)*this.z;
        this.z = -Math.sin(rad)*_x+Math.cos(rad)*this.z;
        return this;
    }

    rotZ(deg){
        let rad = convertRad(deg),_x=this.x;
        this.x = Math.cos(rad)*this.x-Math.sin(rad)*this.y;
        this.y = Math.sin(rad)*_x+Math.cos(rad)*this.y;
        return this;
    }

    set(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    int(){
        this.x = (0.5 + this.x) << 0;
        this.y = (0.5 + this.y) << 0;
        this.z = (0.5 + this.z) << 0;

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