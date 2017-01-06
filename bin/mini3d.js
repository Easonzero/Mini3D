/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-28.
	 */
	let geometry = __webpack_require__(1);
	let renderer = __webpack_require__(2);
	let shape = __webpack_require__(7);
	let scence = __webpack_require__(11);
	let Camera = __webpack_require__(12);
	let Light = __webpack_require__(13);

	window.Mini = window.Mini3D = {
	    Geometry : geometry,
	    Renderer : renderer,
	    Shape : shape,
	    Scence : scence,
	    Camera : Camera,
	    Light : Light
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 16-12-28.
	 */
	function convertRad(deg){
	    return deg*Math.PI/180;
	}

	class Vec3{
	    constructor(x,y,z){
	        this.x = x;
	        this.y = y;
	        this.z = z;
	    }

	    add(vec3){
	        return new Vec3(
	            this.x+vec3.x,
	            this.y+vec3.y,
	            this.z+vec3.z
	        )
	    }

	    substact(vec3){
	        return new Vec3(
	            this.x-vec3.x,
	            this.y-vec3.y,
	            this.z-vec3.z
	        )
	    }

	    cross(vec3){
	        return new Vec3(
	            this.y*vec3.z-vec3.y*this.z,
	            -this.x*vec3.z+vec3.x*this.z,
	            this.x*vec3.y-vec3.x*this.y
	        )
	    }

	    dot(vec3){
	        return this.x*vec3.x+this.y*vec3.y+this.z*vec3.z;
	    }

	    multi(num){
	        return new Vec3(
	            this.x*num,
	            this.y*num,
	            this.z*num
	        )
	    }

	    divide(num){
	        return new Vec3(
	            this.x/num,
	            this.y/num,
	            this.z/num
	        )
	    }

	    normalize(c=1){
	        let l = Math.hypot(this.x,this.y,this.z)/c;
	        this.x /= l;
	        this.y /= l;
	        this.z /= l;

	        return this;
	    }

	    rotX(deg){
	        let rad = convertRad(deg),_y = this.y;
	        this.y = Math.cos(rad)*this.y-Math.sin(rad)*this.z;
	        this.z = Math.sin(rad)*_y+Math.cos(rad)*this.z;
	        return this;
	    }

	    rotY(deg){
	        let rad = convertRad(deg),_x=this.x;
	        this.x = Math.cos(rad)*this.x+Math.sin(rad)*this.z;
	        this.z = -Math.sin(rad)*_x+Math.cos(rad)*this.z;
	        return this;
	    }

	    rotZ(deg){
	        let rad = convertRad(deg),_x=this.x;
	        this.x = Math.cos(rad)*this.x-Math.sin(rad)*this.y;
	        this.y = Math.sin(rad)*_x+Math.cos(rad)*this.y;
	        return this;
	    }

	    set(x,y,z){
	        this.x = x;
	        this.y = y;
	        this.z = z;

	        return this;
	    }

	    int(){
	        this.x = (0.5 + this.x) << 0;
	        this.y = (0.5 + this.y) << 0;
	        this.z = (0.5 + this.z) << 0;

	        return this;
	    }

	    toVec4(c=1){
	        return $V([this.x,this.y,this.z,c])
	    }
	}

	class Face{
	    constructor(vecs,color){
	        this.vecs = vecs;
	        this.color = color;
	        this.normal = vecs[1].substact(vecs[0]).cross(vecs[2].substact(vecs[1])).normalize(-1);
	    }
	}

	module.exports = {
	    Vec3 : Vec3,
	    Face : Face
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-28.
	 */
	let Shader = __webpack_require__(3);
	let {CanvasRenderer} = __webpack_require__(5);
	let Color = __webpack_require__(4);

	class RenderModel {
	    constructor(vecs,color){
	        this.vecs = vecs;
	        this.color = color;
	        this.ns = [];

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
	        this.context.clear(this.width,this.height,new Color(0x000000));
	        let renderModels = [];
	        for(let object of scence.objects){
	            for(let face of object.faces){
	                if(object._M.x(face.normal.toVec4()).dot(scence.camera.dir.toVec4())-1>=0) {
	                    continue;
	                }
	                let renderModel = new RenderModel([],new Color(0x000000,0));
	                for(let vec of face.vecs){
	                    let out = this.shader.vertex(
	                        object._M.x(vec.toVec4()).add(object.position.toVec4(0)),
	                        scence.camera.M
	                    );
	                    let n = this.shader.vertex(
	                        object._M.x(vec.add(face.normal.multi(face.random)).toVec4()).add(object.position.toVec4(0)),
	                        scence.camera.M
	                    );
	                    renderModel.vecs.push(out.int());
	                    renderModel.ns.push(n);
	                }
	                renderModel.color = this.shader.fragment(Color.copy(face.color),object._M.x(face.normal.toVec4()),...scence.lights).int();
	                renderModel.update();
	                renderModels.push(renderModel);
	            }
	        }

	        this.context.zsort(renderModels);

	        for(let renderModel of renderModels){
	            //this.context.surface(renderModel.vecs).stroke(new Color(0x000000));
	            let vec = new Vec3(0,0,0),n = new Vec3(0,0,0);
	            for(let index=0; index < renderModel.ns.length; index++){
	                vec = vec.add(renderModel.vecs[index]);
	                n = n.add(renderModel.ns[index]);
	            }
	            vec = vec.divide(renderModel.ns.length);
	            n = n.divide(renderModel.ns.length);
	            this.context.line(vec,n).stroke(new Color(0xffffff));
	        }
	    }
	}

	module.exports = Renderer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 17-1-1.
	 */
	/**
	 * Created by eason on 16-12-28.
	 */
	let {Vec3} = __webpack_require__(1);
	let Color = __webpack_require__(4);

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
	        let I = 0;
	        for(let light of lights){
	            I += light.cal(n);
	        }
	        return color.multi(I);
	    }
	}

	module.exports = Shader;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 16-12-31.
	 */
	class Color{
	    constructor(color,a){
	        this.r = color>>16&0xff;
	        this.g = color>>8&0xff;
	        this.b = color&0xff;
	        this.a = a!==undefined?a:0xff;
	    }

	    static copy(color){
	        let _color = new Color(0xffffff);
	        _color.r = color.r;
	        _color.g = color.g;
	        _color.b = color.b;
	        _color.a = color.a;
	        return _color;
	    }

	    add(color){
	        this.r+=color.r;
	        this.g+=color.g;
	        this.b+=color.b;

	        return this;
	    }

	    divide(num){
	        this.r/=num;
	        this.g/=num;
	        this.b/=num;

	        return this;
	    }

	    multi(num){
	        this.r*=num;
	        this.g*=num;
	        this.b*=num;

	        return this;
	    }

	    int(){
	        this.r = (0.5 + this.r) << 0;
	        this.g = (0.5 + this.g) << 0;
	        this.b = (0.5 + this.b) << 0;

	        return this;
	    }
	}

	module.exports = Color;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let CanvasRenderer = __webpack_require__(6);

	module.exports = {
	    CanvasRenderer:CanvasRenderer
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

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

	    clear(width,height,color){
	        this.ctx.clearRect(0,0,width,height);
	        this.ctx.fillStyle=`rgba(${color.r},${color.g},${color.b},${color.a})`;
	        this.ctx.fillRect(0,0,width,height);
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let Cube = __webpack_require__(8);
	let Sphere = __webpack_require__(10);
	module.exports = {
	    Cube:Cube,
	    Sphere:Sphere
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Face} = __webpack_require__(1);
	let Color = __webpack_require__(4);
	let Transformable = __webpack_require__(9);

	class Cube extends Transformable{
	    constructor(center,size){
	        super();
	        this.type = 'shape';

	        let d = size/2;

	        this.position = center;

	        this.vecs = [
	            new Vec3(d,d,d),
	            new Vec3(d,d,-d),
	            new Vec3(d,-d,d),
	            new Vec3(d,-d,-d),
	            new Vec3(-d,d,d),
	            new Vec3(-d,d,-d),
	            new Vec3(-d,-d,d),
	            new Vec3(-d,-d,-d),
	        ];

	        this.color = [
	            new Color(0xff0000),
	            new Color(0xffff00),
	            new Color(0xff00ff),
	            new Color(0x00ff00),
	            new Color(0x00ffff),
	            new Color(0xeeeeee),
	        ];

	        this.faces = [
	            new Face([this.vecs[4], this.vecs[5], this.vecs[1], this.vecs[0]],this.color[0]),//top
	            new Face([this.vecs[4], this.vecs[0], this.vecs[2], this.vecs[6]],this.color[1]),//front
	            new Face([this.vecs[2], this.vecs[0], this.vecs[1], this.vecs[3]],this.color[2]),//right
	            new Face([this.vecs[5], this.vecs[4], this.vecs[6], this.vecs[7]],this.color[3]),//left
	            new Face([this.vecs[5], this.vecs[7], this.vecs[3], this.vecs[1]],this.color[4]),//back
	            new Face([this.vecs[7], this.vecs[6], this.vecs[2], this.vecs[3]],this.color[5]),//bottom
	        ];
	    }
	}

	module.exports = Cube;

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 17-1-1.
	 */
	function convertRad(deg){
	    return deg*Math.PI/180;
	}

	class Transformable {
	    constructor(){
	        this._M = Matrix.I(4);
	    }

	    transform(m){
	        this._M = this._M.x(m);
	    }

	    scale(x=1,y=1,z=1){
	        this.transform($M([
	            [x,0,0,0],
	            [0,y,0,0],
	            [0,0,z,0],
	            [0,0,0,1]
	        ]));
	        return this;
	    }

	    rotX(deg){
	        let rad = convertRad(deg);
	        this.transform($M([
	            [1,             0,              0, 0],
	            [0, Math.cos(rad), -Math.sin(rad), 0],
	            [0, Math.sin(rad),  Math.cos(rad), 0],
	            [0,             0,              0, 1]
	        ]));
	        return this;
	    }

	    rotY(deg){
	        let rad = convertRad(deg);
	        this.transform($M([
	            [ Math.cos(rad), 0, Math.sin(rad), 0],
	            [             0, 1,             0, 0],
	            [-Math.sin(rad), 0, Math.cos(rad), 0],
	            [             0, 0,             0, 1]
	        ]));
	        return this;
	    }

	    rotZ(deg){
	        let rad = convertRad(deg);
	        this.transform($M([
	            [Math.cos(rad), -Math.sin(rad), 0, 0],
	            [Math.sin(rad),  Math.cos(rad), 0, 0],
	            [            0,              0, 1, 0],
	            [            0,              0, 0, 1]
	        ]));
	        return this;
	    }

	    translate(x=0,y=0,z=0){
	        this.transform($M([
	            [1,0,0,x],
	            [0,1,0,y],
	            [0,0,1,z],
	            [0,0,0,1]
	        ]));
	        return this;
	    }

	    reset(){
	        this._M = $M.I(4);
	        return this;
	    }
	}

	module.exports = Transformable;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 17-1-2.
	 */
	let {Face} = __webpack_require__(1);
	let Color = __webpack_require__(4);
	let Transformable = __webpack_require__(9);

	class Sphere extends Transformable{
	    constructor(center,r,s=1,color){
	        super();
	        this.type = 'shape';

	        this.position = center;
	        this.vecs = [];
	        this.faces = [];
	        this.color = new Color(color);

	        let d = 0.5*Math.PI/s;
	        let q = [];

	        for(let i=0;i<=Math.PI*2+1;i+=d){
	            for(let j=-0.5*Math.PI;j<=0.5*Math.PI;j+=d){
	                let index = this.vecs.length;

	                let vec = new Vec3(
	                    Math.cos(j)*Math.sin(i)*r,
	                    Math.sin(j)*r,
	                    Math.cos(j)*Math.cos(i)*r
	                );

	                if(q.length>=2*s+1){
	                    let one = q.shift();
	                    if(j!==0.5*Math.PI){
	                        this.faces.push(new Face([
	                            this.vecs[q[0]],vec,this.vecs[one]
	                        ],this.color));
	                    }

	                    if(j!==-0.5*Math.PI){
	                        this.faces.push(new Face([
	                            this.vecs[one],vec,this.vecs[q[q.length-1]]
	                        ],this.color));
	                    }
	                }

	                this.vecs.push(vec);
	                q.push(index);
	            }
	        }
	    }
	}

	module.exports = Sphere;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {PerspectiveCamera} = __webpack_require__(12);
	let {AmbientLight} = __webpack_require__(13);

	class Scence {
	    constructor(){
	        this.camera = new PerspectiveCamera();
	        this.lights = [new AmbientLight()];
	        this.objects = [];
	    }

	    add(something){
	        switch(something.type){
	            case 'camera':
	                this.camera = something;
	                break;
	            case 'direct-light':
	            case 'point-light':
	            case 'ambient-light':
	                this.lights.push(something);
	                break;
	            case 'shape':
	                this.objects.push(something);
	                break;
	        }
	    }
	}

	module.exports = Scence;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Vec3} = __webpack_require__(1);
	let Transformable = __webpack_require__(9);

	class Camera extends Transformable{
	    constructor(){
	        super();
	        this.type = 'camera';
	        this.position = new Vec3(0,0,-100);
	        this.dir = new Vec3(0,0,1);
	    }

	    update(){
	        let w = new Vec3(this.dir.x,this.dir.y,this.dir.z).normalize(-1);
	        let u = new Vec3(0,1,0).cross(w).normalize();
	        let v = w.cross(u);
	        let r = $M([
	            [u.x,u.y,u.z,0],
	            [v.x,v.y,v.z,0],
	            [w.x,w.y,w.z,0],
	            [0     ,     0,     0,1]
	        ]);

	        let t = $M([
	            [1,0,0,-this.position.x],
	            [0,1,0,-this.position.y],
	            [0,0,1,-this.position.z],
	            [0,0,0,               1]
	        ]);
	        this.M = this.projection.x(r).x(t);
	    }

	    lookAt(aim){
	        this.dir.x = aim.x - this.position.x;
	        this.dir.y = aim.y - this.position.y;
	        this.dir.z = aim.z - this.position.z;

	        this.update();
	    }

	    lookBy(dir){
	        this.dir = dir;

	        this.update();
	    }
	}

	class PerspectiveCamera extends Camera{
	    constructor(deg=90,r=1,n=50,f=100){
	        super();
	        let tan = Math.tan(deg*Math.PI/360);
	        let tann = tan*n;

	        this.project(-tann,tann,-tann*r,tann*r,n,f);
	    }

	    project(l=-1,r=1,b=-1,t=1,n=1,f=100){
	        this.projection = $M([
	            [2*n,              0,(l+r)/(l-r),          0],
	            [  0,2*n*(t-b)/(r-l),(t+b)/(t-b),          0],
	            [  0,              0,(f+n)/(n-f),f*n*2/(f-n)],
	            [  0,              0,          1,          0]
	        ]);
	        this.update();
	    }
	}

	class OrthophotoCamera extends Camera{
	    constructor(deg,r,n,f){
	        super();

	        this.project();
	    }

	    project(l=-1,r=1,b=-1,t=1,n=1,f=100){
	        this.projection = $M([
	            [2/(r-l),      0,      0,-(l+r)/2],
	            [      0,2/(t-b),      0,-(t+b)/2],
	            [      0,      0,2/(n-f),-(n+f)/2],
	            [      0,      0,      0,       1]
	        ]);
	        this.update();
	    }
	}

	module.exports = {
	    PerspectiveCamera : PerspectiveCamera,
	    OrthophotoCamera : OrthophotoCamera
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let Transformable = __webpack_require__(9);

	class PointLight extends Transformable{
	    constructor(color=0xffffff,cl=0.7,pos){
	        super();
	        this.type='point-light';

	        this.c = color/0xffffff;
	        this.position = pos;
	    }

	    cal(n,vec){
	        let dir = vec.substact(this.position);
	        let d = dir.x*dir.x+dir.y*dir.y+dir.z*dir.z;
	        return this.c*this.cl*Math.max(0,n.dot(this._M.x(dir.toVec4())-1))/(d*d);
	    }
	}

	class DirectLight extends Transformable{
	    constructor(color=0xffffff,cl=0.7,dir){
	        super();
	        this.type='direct-light';

	        this.c = color/0xffffff;
	        this.cl = cl;
	        this.dir = dir.normalize();
	    }

	    cal(n){
	        return this.c*this.cl*Math.max(0,n.dot(this._M.x(this.dir.toVec4()))-1);
	    }
	}

	class AmbientLight extends Transformable{
	    constructor(color=0xffffff,ca=0.3){
	        super();
	        this.type='ambient-light';

	        this.c = color/0xffffff;
	        this.ca = ca;
	    }

	    cal(n){
	        return this.c*this.ca;
	    }
	}

	module.exports = {
	    AmbientLight:AmbientLight,
	    DirectLight:DirectLight,
	    PointLight:PointLight
	};

/***/ }
/******/ ]);