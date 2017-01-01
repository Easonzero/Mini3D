/**
 * Created by eason on 16-12-28.
 */
let body = document.getElementsByTagName('body')[0];

let Cube = Mini.Shape.Cube;
let Vec3 = Mini.Geometry.Vec3;
let Scence = Mini.Scence;
let Camera = Mini.Camera;
let CameraConfig = Mini.CameraConfig;

let renderer = new Mini.Renderer('canvas',body,700,500);
let camera = new Camera(CameraConfig.build('perspective').init());
camera.position.set(0,0,-50);
let scence = new Scence();
let cube = new Cube(new Vec3(0,0,0),50);
scence.add(cube);
scence.add(camera);

animate();

function animate(){
   requestAnimationFrame(animate);
    renderer.render(scence);
    cube.rotY(1).rotX(1).rotZ(1);
}