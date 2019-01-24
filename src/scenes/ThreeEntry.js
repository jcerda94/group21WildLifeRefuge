import SceneManager from './SceneManager';
import cameraControl from "./AmbientLight";
import * as THREE from "three";

function createCanvas (document, containerElement) {
  const canvas = document.createElement('canvas');
  containerElement.appendChild(canvas);
  return canvas;
}

class ThreeEntry {
  constructor (container) {
    this.clock = new THREE.Clock();
    this.canvas = createCanvas(document, container);
    this.sceneManager = SceneManager(this.canvas);
    this.bindEventListeners();
    this.render();
  }

  bindEventListeners () {
    window.onresize = this.resizeCanvas;
    this.resizeCanvas();
  }

  resizeCanvas () {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.sceneManager.onWindowResize();
  }

  render = () => {
    //const delta = this.clock.getDelta();
   // cameraControl.update(delta);
    requestAnimationFrame(this.render);
    this.sceneManager.update();
  }
}

export default ThreeEntry;
