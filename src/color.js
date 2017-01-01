/**
 * Created by eason on 16-12-31.
 */
class Color{
    constructor(color){
        if(color>>24==0){
            color = color<<8|0xff;
        }

        this.r = color>>24&0xff;
        this.g = color>>16&0xff;
        this.b = color>>8&0xff;
        this.a = color&0xff;
    }

    static copy(color){
        let _color = new Color(0xffffff);
        _color.r = color.r;
        _color.g = color.g;
        _color.b = color.b;
        _color.a = color.a;
        return _color;
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