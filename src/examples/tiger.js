import {
  Color,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  DirectionalLight
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import gltfFile from "../models/duck/Duck.gltf";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer;

function init() {
  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  // Instantiate a loader
  var loader = new GLTFLoader();

  scene = new Scene();
  scene.background = new Color(0xffffff);
  controls;

  var directionalLight = new DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  var directionalLight2 = new DirectionalLight(0xffeedd);
  directionalLight2.position.set(0, 5, -5);
  scene.add(directionalLight2);

  controls = new OrbitControls(camera, renderer.domElement);

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 10;
  controls.maxDistance = 100;

  controls.maxPolarAngle = Math.PI / 2;
  // Load a glTF resource
  loader.load(
    // resource URL
    gltfFile,
    // called when the resource is loaded
    function(gltf) {
      scene.add(gltf.scene);

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Scene
      gltf.scenes; // Array<THREE.Scene>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
      renderer.render(scene, camera);
    },
    // called while loading is progressing
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function(error) {
      console.log("An error happened");
      console.log(error);
    }
  );
}

function render() {
  renderer.render(scene, camera);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();
}

init();
animate();
