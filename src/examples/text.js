import * as THREE from "three";
import { log } from "three";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 40;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

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
    const loader = new THREE.FontLoader();
    // promisify font loading
    function loadFont(url) {
      return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });
    }

    async function doit() {
      const font = await loadFont("../src/fonts/helvet.typeface.json");
      const geometry = new THREE.TextBufferGeometry("Hi", {
        font: font,
        size: 3.0,
        height: 0.2,
        curveSegments: 1,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.3,
        bevelSegments: 1
      });
      const mesh = new THREE.Mesh(geometry, createMaterial());
      geometry.computeBoundingBox();
      geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

      const parent = new THREE.Object3D();
      parent.add(mesh);

      addObject(0, 0, parent);
      console.log(objects);
    }
    doit();
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
