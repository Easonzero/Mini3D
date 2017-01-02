/**
 * Created by eason on 16-12-28.
 */
let Shader = require('./shader');
let {CanvasRenderer} = require('./render/index');
let Color = require('./color');

class RenderModel {
    constructor(vecs,color){
        this.vecs = vecs;
        this.color = color;

        this.update();
    }

    static getCenterZ(vecs){
        let sum=0;
        for(let vec of vecs){
            sum+=vec.z;
        }
        return sum/vecs.length||0;
    }

    update(){
        this.centerZ = RenderModel.getCenterZ(this.vecs);
    }
}

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
        let renderModels = [];
        for(let object of scence.objects){
            for(let face of object.faces){
                if(face.normal.multi(scence.camera.dir)>0) continue;
                let renderModel = new RenderModel([],new Color(0x000000ff));
                for(let vec of face.vecs){
                    let rv = this.shader.vertex(
                        object._M.x(vec.toVec4()).add(object.position.toVec4()),
                        face.color,
                        scence.camera.M
                    );
                    renderModel.vecs.push(rv[0]);
                    renderModel.color.add(rv[1]);
                }
                renderModel.color.divide(face.vecs.length);
                renderModel.update();
                renderModels.push(renderModel);
            }
        }

        renderModels.sort((a,b)=>{
            return a.centerZ - b.centerZ;
        });

        for(let renderModel of renderModels){
            this.context.surface(renderModel.vecs);
            this.context.fill(renderModel.color);
        }
    }
}

module.exports = Renderer;