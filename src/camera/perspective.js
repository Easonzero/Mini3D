/**
 * Created by eason on 16-12-31.
 */
class Perspective{
    init(deg = 90, r = 700/500, near=1, far=100){
        return $M([
            [near,                0,                    0,                     0],
            [                    0,near,                    0,                     0],
            [                    0,                0,near+far,-far*near],
            [                    0,                0,                    1,                     0]
        ]);
    }
}

module.exports = Perspective;