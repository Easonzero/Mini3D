/**
 * Created by eason on 16-12-31.
 */
class Perspective{
    init(left=-1, right=1, bottom=-1, top=1, near=1, far=100){
        return $M([
            [2*near/(right-left),                  0,(right+left)/(right-left),                    0],
            [                  0,2*near/(top-bottom),(top+bottom)/(top-bottom),                    0],
            [                  0,                  0,   -(far+near)/(far-near),far*near*2/(far-near)],
            [                  0,                  0,                       -1,                    0]
        ]);
    }
}

module.exports = Perspective;