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
            new Color(0xff0000ff),
            new Color(0xffff00ff),
            new Color(0xff00ffff),
            new Color(0x00ff00ff),
            new Color(0x00ffffff),
            new Color(0x00ff00ff),
        ];

        this.faces = [
            new Face([4, 5, 1],this.color[0]),new Face([1, 0, 4],this.color[0]),//top
            new Face([4, 0, 2],this.color[1]),new Face([2, 6, 4],this.color[1]),//front
            new Face([1, 0, 2],this.color[2]),new Face([2, 3, 1],this.color[2]),//right
            new Face([5, 4, 6],this.color[3]),new Face([6, 7, 5],this.color[3]),//left
            new Face([5, 1, 3],this.color[4]),new Face([3, 7, 5],this.color[4]),//back
            new Face([7, 3, 2],this.color[5]),new Face([2, 6, 7],this.color[5])//bottom
        ];
    }
}

module.exports = Cube;