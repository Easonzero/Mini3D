/**
 * Created by eason on 17-1-1.
 */
function convertRad(deg){
    return deg*Math.PI/180;
}

class Transformable {
    constructor(){
        this._M = Matrix.I(4);
    }

    transform(m){
        this._M = this._M.x(m);
    }

    scale(x,y,z){
        this.transform($M([
            [x,0,0,0],
            [0,y,0,0],
            [0,0,z,0],
            [0,0,0,1]
        ]));
        return this;
    }

    rotX(deg){
        let rad = convertRad(deg);
        this.transform($M([
            [1,             0,              0, 0],
            [0, Math.cos(rad), -Math.sin(rad), 0],
            [0, Math.sin(rad),  Math.cos(rad), 0],
            [0,             0,              0, 1]
        ]));
        return this;
    }

    rotY(deg){
        let rad = convertRad(deg);
        this.transform($M([
            [ Math.cos(rad), 0, Math.sin(rad), 0],
            [             0, 1,             0, 0],
            [-Math.sin(rad), 0, Math.cos(rad), 0],
            [             0, 0,             0, 1]
        ]));
        return this;
    }

    rotZ(deg){
        let rad = convertRad(deg);
        this.transform($M([
            [Math.cos(rad), -Math.sin(rad), 0, 0],
            [Math.sin(rad),  Math.cos(rad), 0, 0],
            [            0,              0, 1, 0],
            [            0,              0, 0, 1]
        ]));
        return this;
    }

    translate(x,y,z){
        this.transform($M([
            [1,0,0,x],
            [0,1,0,y],
            [0,0,1,z],
            [0,0,0,1]
        ]));
        return this;
    }

    reset(){
        this._M = $M.I(4);
        return this;
    }
}

module.exports = Transformable;