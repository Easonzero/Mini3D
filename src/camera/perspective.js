/**
 * Created by eason on 16-12-31.
 */
class Perspective{
    init(deg = 1, r = 500/500, near=1, far=100){
        let tan = Math.tan(deg*Math.PI/360);
        return $M([
            [1/(r*tan),    0,                    0,                     0],
            [        0,1/tan,                    0,                     0],
            [        0,    0,(far+near)/(far-near),-far*near*2/(far-near)],
            [        0,    0,                    1,                     0]
        ]);
    }
}

module.exports = Perspective;