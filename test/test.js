/**
 * Created by eason on 16-12-28.
 */
let body = document.getElementsByTagName('body')[0];

let Sphere = Mini.Shape.Sphere;
let Vec3 = Mini.Geometry.Vec3;
let Scence = Mini.Scence;
let Camera = Mini.Camera;
let CameraConfig = Mini.CameraConfig;
let DirectLight = Mini.Light.DirectLight;

let renderer = new Mini.Renderer('canvas',body,700,500);
let scence = new Scence();
let directLight = new DirectLight(0xffffff,0.7,new Vec3(1,0,0));
scence.add(directLight);
let camera = new Camera(CameraConfig.build('perspective').init());
camera.position.set(0,0,-50);
scence.add(camera);
let sphere = new Sphere(new Vec3(0,0,0),80,9,0xffffff);
scence.add(sphere);

animate();

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scence);
    sphere.rotY(1).rotZ(1).rotX(1);
}