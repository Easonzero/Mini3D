/**
 * Created by eason on 16-12-31.
 */
let {Face} = require('../geometry');
let Color = require('../color');
let Transformable = require('../transformable');

class Cube extends Transformable{
    constructor(center,size){
        super();
        this.type = 'shape';

        let d = size/2;

        this.position = center;

        this.vecs = [
            new Vec3(d,d,d),
            new Vec3(d,d,-d),
            new Vec3(d,-d,d),
            new Vec3(d,-d,-d),
            new Vec3(-d,d,d),
            new Vec3(-d,d,-d),
            new Vec3(-d,-d,d),
            new Vec3(-d,-d,-d),
        ];

        this.color = [
            new Color(0xff0000),
            new Color(0xffff00),
            new Color(0xff00ff),
            new Color(0x00ff00),
            new Color(0x00ffff),
            new Color(0xeeeeee),
        ];

        this.faces = [
            new Face([this.vecs[4], this.vecs[5], this.vecs[1], this.vecs[0]],this.color[0]),//top
            new Face([this.vecs[4], this.vecs[0], this.vecs[2], this.vecs[6]],this.color[1]),//front
            new Face([this.vecs[2], this.vecs[0], this.vecs[1], this.vecs[3]],this.color[2]),//right
            new Face([this.vecs[5], this.vecs[4], this.vecs[6], this.vecs[7]],this.color[3]),//left
            new Face([this.vecs[5], this.vecs[7], this.vecs[3], this.vecs[1]],this.color[4]),//back
            new Face([this.vecs[7], this.vecs[6], this.vecs[2], this.vecs[3]],this.color[5]),//bottom
        ];
    }
}

module.exports = Cube;