import * as THREE from "three";
import { log } from "three";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";




function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  let controls
  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 4000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 400;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);
  
  // controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  // controls.dampingFactor = 0.05;

  // controls.screenSpacePanning = false;

  // controls.minDistance = 100;
  // controls.maxDistance = 2000;

  // controls.maxPolarAngle = Math.PI / 2;

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }

  const objects = [];
  const spread = 15;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
    window.objects = objects
  }

  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  {
    var onProgress = function ( xhr ) {

      if ( xhr.lengthComputable ) {

        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

      }

    };

    var onError = function () { };
    var manager = new THREE.LoadingManager();
    manager.addHandler( /\.dds$/i, new DDSLoader() )
    new MTLLoader( manager )
					.setPath( '../src/models/chair/' )
					.load( 'stu.mtl', function ( materials ) {

						materials.preload();
						new OBJLoader( manager )
							.setMaterials( materials )
							.setPath( '../src/models/chair/' )
							.load( 'stu.obj', function ( object ) {

                object.position.z = - 2000;
                addObject(0,-20,object)
								// scene.add( object );

							}, onProgress, onError );

					} );
   
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj, ndx) => {
      const speed = 0.5 + ndx * 0.05;
      const rot = time * speed;
      obj.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
