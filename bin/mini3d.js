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
	let scence = __webpack_require__(10);
	let {Camera,CameraConfig} = __webpack_require__(11);

	window.Mini = window.Mini3D = {
	    Geometry : geometry,
	    Renderer : renderer,
	    Shape : shape,
	    Scence : scence,
	    Camera : Camera,
	    CameraConfig : CameraConfig
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 16-12-28.
	 */
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
	            this.x*vec3.z-vec3.x*this.z,
	            this.x*vec3.y-vec3.x*this.y
	        )
	    }

	    multi(vec3){
	        return this.x*vec3.x+this.y*vec3.y+this.z*vec3.z;
	    }

	    set(x,y,z){
	        this.x = x;
	        this.y = y;
	        this.z = z;

	        return this;
	    }

	    toVec4(){
	        return $V([this.x,this.y,this.z,1])
	    }
	}

	class Face{
	    constructor(vecs,color){
	        this.vecs = vecs;
	        this.color = color;
	        this.normal = vecs[0].substact(vecs[1]).cross(vecs[1].substact(vecs[2]));
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
	let {CanvasRenderer} = __webpack_require__(4);
	let Color = __webpack_require__(6);

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

	class Shader {
	    constructor(width,height){
	        this.M = $M([
	            [      1,       0,0, (width-1)/2],
	            [      0,      -1,0,(height-1)/2],
	            [      0,       0,1,           0],
	            [      0,       0,0,           1]
	        ])
	    }

	    vertex(vec,color,M){
	        let out = this.M.x(M).x(vec);
	        return [
	            new Vec3(out.e(1)/out.e(4),out.e(2)/out.e(4),out.e(3)/out.e(4)),
	            color
	        ];
	    }
	}

	module.exports = Shader;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let CanvasRenderer = __webpack_require__(5);

	module.exports = {
	    CanvasRenderer:CanvasRenderer
	};

/***/ },
/* 5 */
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

	    cycle(center,r){
	        this.ctx.beginPath();
	        this.ctx.arc(center.x, center.y, r, 0, 2*Math.PI, true);
	        return this;
	    }
	}

	module.exports = CanvasRenderer;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 16-12-31.
	 */
	class Color{
	    constructor(color){
	        if(color>>24==0){
	            color = color<<8|0xff;
	        }

	        this.r = color>>24&0xff;
	        this.g = color>>16&0xff;
	        this.b = color>>8&0xff;
	        this.a = color&0xff;
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
	        this.a+=color.a;
	    }

	    divide(num){
	        this.r/=num;
	        this.g/=num;
	        this.b/=num;
	        this.a/=num;
	    }
	}

	module.exports = Color;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let Cube = __webpack_require__(8);
	module.exports = {
	    Cube:Cube
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Face} = __webpack_require__(1);
	let Color = __webpack_require__(6);
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
	            new Color(0xff0000ff),
	            new Color(0xffff00ff),
	            new Color(0xff00ffff),
	            new Color(0x00ff00ff),
	            new Color(0x00ffffff),
	            new Color(0x00ff00ff),
	        ];

	        this.faces = [
	            new Face([this.vecs[4], this.vecs[5], this.vecs[1]],this.color[0]),
	            new Face([this.vecs[1], this.vecs[0], this.vecs[4]],this.color[0]),//top
	            new Face([this.vecs[4], this.vecs[0], this.vecs[2]],this.color[1]),
	            new Face([this.vecs[2], this.vecs[6], this.vecs[4]],this.color[1]),//front
	            new Face([this.vecs[1], this.vecs[0], this.vecs[2]],this.color[2]),
	            new Face([this.vecs[2], this.vecs[3], this.vecs[1]],this.color[2]),//right
	            new Face([this.vecs[5], this.vecs[4], this.vecs[6]],this.color[3]),
	            new Face([this.vecs[6], this.vecs[7], this.vecs[5]],this.color[3]),//left
	            new Face([this.vecs[5], this.vecs[1], this.vecs[3]],this.color[4]),
	            new Face([this.vecs[3], this.vecs[7], this.vecs[5]],this.color[4]),//back
	            new Face([this.vecs[7], this.vecs[3], this.vecs[2]],this.color[5]),
	            new Face([this.vecs[2], this.vecs[6], this.vecs[7]],this.color[5])//bottom
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

	    scale(x,y,z){
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

	    translate(x,y,z){
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
	 * Created by eason on 16-12-31.
	 */
	let {Camera,CameraConfig} = __webpack_require__(11);

	class Scence {
	    constructor(){
	        this.camera = new Camera(CameraConfig.build('perspective').init());
	        this.light = [];
	        this.objects = [];
	    }

	    add(something){
	        switch(something.type){
	            case 'camera':
	                this.camera = something;
	                break;
	            case 'light':
	                this.light.push(something);
	                break;
	            case 'shape':
	                this.objects.push(something);
	                break;
	        }
	    }
	}

	module.exports = Scence;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Vec3} = __webpack_require__(1);
	let {Perspective,Orthophoto} = __webpack_require__(12);
	let Transformable = __webpack_require__(9);

	class CameraConfig{
	    static build(type){
	        switch (type.toUpperCase()){
	            case 'PERSPECTIVE':
	                return new Perspective();
	            case 'ORTHOPHOTO':
	                return new Orthophoto();
	        }
	    }
	}

	class Camera extends Transformable{
	    constructor(config){
	        super();
	        this.type = 'camera';
	        this.position = new Vec3(0,0,-50);
	        this.dir = new Vec3(0,0,1);

	        this.config = config;

	        this.update();
	    }

	    update(){
	        let w = $V([this.dir.x,this.dir.y,this.dir.z]).x(-1/Math.hypot(this.dir.x,this.dir.y,this.dir.z));
	        let u = $V([0,1,0]).cross(w);
	        u = u.x(1/Math.hypot(u.e(1),u.e(2),u.e(3)));
	        let v = w.cross(u);
	        let r = $M([
	            [u.e(1),u.e(2),u.e(3),0],
	            [v.e(1),v.e(2),v.e(3),0],
	            [w.e(1),w.e(2),w.e(3),0],
	            [0     ,     0,     0,1]
	        ]);

	        let t = $M([
	            [1,0,0,-this.position.x],
	            [0,1,0,-this.position.y],
	            [0,0,1,-this.position.z],
	            [0,0,0,               1]
	        ]);
	        this.M = this.config.x(r).x(t);
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

	module.exports = {
	    CameraConfig : CameraConfig,
	    Camera : Camera
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let Perspective = __webpack_require__(13);
	let Orthophoto = __webpack_require__(14);

	module.exports = {
	  Perspective:Perspective,
	  Orthophoto:Orthophoto
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 16-12-31.
	 */
	class Perspective{
	    init(deg = 0.9, r = 500/500, near=1, far=100){
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

/***/ },
/* 14 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);