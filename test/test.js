/**
 * Created by eason on 16-12-28.
 */
let body = document.getElementsByTagName('body')[0];

let Sphere = Mini.Shape.Sphere;
let Vec3 = Mini.Geometry.Vec3;
let Scence = Mini.Scence;
let PerspectiveCamera = Mini.Camera.PerspectiveCamera;
let DirectLight = Mini.Light.DirectLight;

let renderer = new Mini.Renderer('canvas',body,700,500);
let scence = new Scence();
let directLight = new DirectLight(0xffffff,0.7,new Vec3(1,0,0));
scence.add(directLight);
let camera = new PerspectiveCamera();
camera.position.set(0,0,-50);
scence.add(camera);
let sphere = new Sphere(new Vec3(0,0,0),60,10,0xff0000);
scence.add(sphere);

for(let face of sphere.faces){
    face.random = Math.random()*20+1;
}

animate();

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scence);
    sphere.rotX(1).rotY(1).rotZ(1);
    directLight.rotZ(-1);
}