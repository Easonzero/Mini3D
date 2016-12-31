/**
 * Created by eason on 16-12-28.
 */
let Shader = require('./shader');
let {CanvasRenderer} = require('./render/index');

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
        this.context.clear();
        for(let object of scence.objects){
            for(let face of object.faces){
                let vecs = [], color = face.color;
                for(let index of face.vecs){
                    let d2 = this.shader.vertex(
                        object.vecs[index].add(object.position),
                        face.color,
                        scence.camera.M
                    );
                    console.log(d2[0])
                    vecs.push(d2[0]);
                    color.add(d2[1])
                }
                color.divide(face.vecs.length);
                this.context.surface(vecs);
                this.context.fill(color);
            }
        }
    }
}

module.exports = Renderer;