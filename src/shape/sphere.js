/**
 * Created by eason on 17-1-2.
 */
let {Face} = require('../geometry');
let Color = require('../color');
let Transformable = require('../transformable');

class Sphere extends Transformable{
    constructor(center,r,s=1,color){
        super();
        this.type = 'shape';

        this.position = center;
        this.vecs = [];
        this.faces = [];
        this.color = new Color(color);

        let d = 0.5*Math.PI/s;
        let q = [];

        for(let i=0;i<=Math.PI*2;i+=d){
            for(let j=-0.5*Math.PI;j<=0.5*Math.PI;j+=d){
                let index = this.vecs.length;

                let vec = new Vec3(
                    Math.cos(j)*Math.sin(i)*r,
                    Math.sin(j)*r,
                    Math.cos(j)*Math.cos(i)*r
                );

                if(q.length>=2*s){
                    let one = q.shift();
                    if(j!==0.5*Math.PI){
                        this.faces.push(new Face([
                            this.vecs[q[0]],vec,this.vecs[one]
                        ],this.color));
                    }

                    if(j!==-0.5*Math.PI){
                        this.faces.push(new Face([
                            this.vecs[one],vec,this.vecs[q[q.length-1]]
                        ],this.color));
                    }
                }

                this.vecs.push(vec);
                q.push(index);
            }
        }
    }
}

module.exports = Sphere;