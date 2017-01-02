/**
 * Created by eason on 16-12-28.
 */
let geometry = require('./src/geometry');
let renderer = require('./src/renderer');
let shape = require('./src/shape/index');
let scence = require('./src/scence');
let {Camera,CameraConfig} = require('./src/camera');
let Light = require('./src/light');

window.Mini = window.Mini3D = {
    Geometry : geometry,
    Renderer : renderer,
    Shape : shape,
    Scence : scence,
    Camera : Camera,
    CameraConfig : CameraConfig,
    Light : Light
};
