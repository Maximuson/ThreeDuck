import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line
} from "three";
import "../css/styles.css";

// Drawing lines
var renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

var scene = new Scene();

//create a blue LineBasicMaterial
var material = new LineBasicMaterial({ color: 0x0000ff });

var points = [];
points.push(new Vector3(-10, 0, 0));
points.push(new Vector3(0, 10, 0));
points.push(new Vector3(10, 0, 0));

var geometry = new BufferGeometry().setFromPoints(points);

var line = new Line(geometry, material);

scene.add(line);
renderer.render(scene, camera);

// Add separator
let hr = document.createElement("hr");
document.body.appendChild(hr);
