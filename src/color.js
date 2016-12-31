/**
 * Created by eason on 16-12-31.
 */
class Color{
    constructor(color){
        if(color>>24==0){
            color <<= 8;
        }

        this.r = color>>24&0xff;
        this.g = color>>16&0xff;
        this.b = color>>8&0xff;
        this.a = color&0xff;
    }

    add(color){
        this.r+=color.r;
        this.g+=color.g;
        this.b+=color.b;
        this.a+=color.a;
    }

    divide(num){
        this.r/=num;
        this.g/=num;
        this.b/=num;
        this.a/=num;
    }
}

module.exports = Color;