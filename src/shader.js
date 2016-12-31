/**
 * Created by eason on 16-12-28.
 */
let {Vec2} = require('./geometry');

class Shader {
    constructor(width,height){
        this.height = height;
        this.width = width;
    }
    vertex(vec,color,M){
        let v = $V([vec.x,vec.y,vec.z,1]);
        let out = M.x(v);
        return [
            new Vec2(out.e(1),this.height/2+out.e(2)),
            color
        ];
    }
}

module.exports = Shader;