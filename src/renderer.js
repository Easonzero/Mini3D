/**
 * Created by eason on 16-12-28.
 */
let Shader = require('./shader');
let {CanvasRenderer} = require('./render/index');
let Color = require('./color');

class Renderer {
    constructor(type,container,width,height){
        this.width = width;
        this.height = height;
        this.context = Renderer.getContext(type.toUpperCase(),container,width,height);
        this.shader = new Shader(width,height);
    }

    static getContext(type,container,width,height){
        switch (type){
            case 'CANVAS':
                return new CanvasRenderer(container,width,height);
        }
    }

    render(scence){
        this.context.clear(this.width,this.height);
        for(let object of scence.objects){
            for(let face of object.faces){
                let vecs = [], color = new Color(0x000000ff);
                for(let index of face.vecs){
                    let d2 = this.shader.vertex(
                        object._M.x(object.vecs[index].toVec4()).add(object.position.toVec4()),
                        face.color,
                        scence.camera.M
                    );
                    vecs.push(d2[0]);
                    color.add(d2[1]);
                }
                color.divide(face.vecs.length);
                this.context.surface(vecs);
                this.context.stroke(color);
            }
        }
    }
}

module.exports = Renderer;