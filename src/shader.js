/**
 * Created by eason on 17-1-1.
 */
/**
 * Created by eason on 16-12-28.
 */
let {Vec3} = require('./geometry');
let Color = require('./color');

class Shader {
    constructor(width,height){
        this.M = $M([
            [      1,       0,0, (width-1)/2],
            [      0,      -1,0,(height-1)/2],
            [      0,       0,1,           0],
            [      0,       0,0,           1]
        ])
    }

    vertex(vec,M){
        let out = this.M.x(M).x(vec);
        return new Vec3(out.e(1)/out.e(4),out.e(2)/out.e(4),out.e(3)/out.e(4))
    }

    fragment(color,n,...lights){
        let out = new Color(0x000000);
        for(let light of lights){
            switch(light.type){
                case 'direct-light':
                case 'ambient-light':
                    out.add(light.cal(Color.copy(color),n));
                    break;
                case 'point-light':
                    break;
            }
        }
        return out;
    }
}

module.exports = Shader;