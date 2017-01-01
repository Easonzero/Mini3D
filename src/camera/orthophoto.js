/**
 * Created by eason on 17-1-1.
 */
class Orthophoto{
    init(l=-1,r=1,b=-1,t=1,n=1,f=100){
        return $M([
            [2/(r-l),      0,      0,-(l+r)/2],
            [      0,2/(t-b),      0,-(t+b)/2],
            [      0,      0,2/(n-f),-(n+f)/2],
            [      0,      0,      0,       1]
        ]);
    }
}

module.exports = Orthophoto;