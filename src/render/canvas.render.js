/**
 * Created by eason on 16-12-31.
 */
class CanvasRenderer {
    constructor(e,width,height){
        let node = document.createElement("CANVAS");
        node.setAttribute('width',width);
        node.setAttribute('height',height);
        e.appendChild(node);

        this.ctx = node.getContext('2d');
    }

    clear(width,height){
        this.ctx.clearRect(0,0,width,height);
    }

    fill(color){
        this.ctx.fillStyle=`rgba(${color.r},${color.g},${color.b},${color.a})`;
        this.ctx.strokeStyle=`rgba(${color.r},${color.g},${color.b},${color.a})`;
        this.ctx.fill();
        this.ctx.stroke();
        return this;
    }

    stroke(color){
        this.ctx.strokeStyle=`rgba(${color.r},${color.g},${color.b},${color.a})`;
        this.ctx.stroke();
        return this;
    }

    surface(vecs){
        this.ctx.beginPath();
        this.ctx.moveTo(vecs[0].x,vecs[0].y);
        for(let i=0;i<vecs.length;i++){
            let next = i==vecs.length-1?0:i+1;
            this.ctx.lineTo(vecs[next].x,vecs[next].y)
        }
        this.ctx.closePath();
        return this;
    }

    line(vec1,vec2){
        this.ctx.beginPath();
        this.ctx.moveTo(vec1.x,vec1.y);
        this.ctx.lineTo(vec2.x,vec2.y);
        this.ctx.closePath();
        return this;
    }

    zsort(renderModels){
        renderModels.sort((a,b)=>{
            return a.centerZ - b.centerZ;
        });
    }

    cycle(center,r){
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, r, 0, 2*Math.PI, true);
        return this;
    }
}

module.exports = CanvasRenderer;