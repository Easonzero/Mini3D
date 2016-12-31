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
	let shape = __webpack_require__(6);
	let scence = __webpack_require__(9);
	let {camera,cameraConfig} = __webpack_require__(10);

	window.Mini = window.Mini3D = {
	    Geometry : geometry,
	    Renderer : renderer,
	    Shape : shape,
	    Scence : scence,
	    Camera : camera,
	    CameraConfig : cameraConfig
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
	}

	class Vec2{
	    constructor(x,y){
	        this.x = Math.round(x);
	        this.y = Math.round(y);
	    }
	}

	class Face{
	    constructor(vecs,color){
	        this.vecs = vecs;
	        this.color = color;
	    }
	}

	module.exports = {
	    Vec3 : Vec3,
	    Vec2 : Vec2,
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
	        this.context.clear();
	        for(let object of scence.objects){
	            for(let face of object.faces){
	                let vecs = [], color = face.color;
	                for(let index of face.vecs){
	                    let d2 = this.shader.vertex(
	                        object.vecs[index].add(object.position),
	                        face.color,
	                        scence.camera.M
	                    );
	                    console.log(d2[0])
	                    vecs.push(d2[0]);
	                    color.add(d2[1])
	                }
	                color.divide(face.vecs.length);
	                this.context.surface(vecs);
	                this.context.fill(color);
	            }
	        }
	    }
	}

	module.exports = Renderer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-28.
	 */
	let {Vec2} = __webpack_require__(1);

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
	        this.ctx.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
	        this.ctx.fill();
	        return this;
	    }

	    stroke(color){
	        this.ctx.strokeStyle=`rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
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
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let Cube = __webpack_require__(7);
	module.exports = {
	    Cube:Cube
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Face} = __webpack_require__(1);
	let Color = __webpack_require__(8);
	class Cube{
	    constructor(center,size){
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
	            new Color(0xeeffffff),
	        ];

	        this.faces = [
	            new Face([4, 5, 1],this.color[0]),new Face([1, 0, 4],this.color[0]),//top
	            new Face([4, 0, 2],this.color[1]),new Face([2, 6, 4],this.color[1]),//front
	            new Face([1, 0, 2],this.color[2]),new Face([2, 3, 1],this.color[2]),//right
	            new Face([5, 4, 6],this.color[3]),new Face([6, 7, 5],this.color[3]),//left
	            new Face([5, 1, 3],this.color[4]),new Face([3, 7, 5],this.color[4]),//back
	            new Face([7, 3, 2],this.color[5]),new Face([2, 6, 7],this.color[5])//bottom
	        ];
	    }
	}

	module.exports = Cube;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Created by eason on 16-12-31.
	 */
	class Color{
	    constructor(color){
	        if(color>>24==0){
	            color <<= 8;
	        }

	        this.r = color>>24&0xff;
	        this.g = color>>16&0xff;
	        this.b = color>>8&0xff;
	        this.a = color&0xff;
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Camera,CameraConfig} = __webpack_require__(10);

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let {Vec3} = __webpack_require__(1);
	let {Perspective} = __webpack_require__(11);

	class CameraConfig{
	    static build(type){
	        switch (type.toUpperCase()){
	            case 'PERSPECTIVE':
	                return new Perspective();
	        }
	    }
	}

	class Camera{
	    constructor(config){
	        this.type = 'camera';
	        this.position = new Vec3(0,0,-50);
	        this.dir = new Vec3(0,0,1);

	        this.config = config;

	        this.update();
	    }

	    update(){
	        let w = $V([this.dir.x,this.dir.y,this.dir.z]).x(-1/Math.hypot(this.dir.x,this.dir.y,this.dir.z));
	        let u = w.cross($V([0,1,0]));
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by eason on 16-12-31.
	 */
	let Perspective = __webpack_require__(12);

	module.exports = {
	  Perspective:Perspective
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);