import SceneManager from "./SceneManager";
import EnvironmentManager from "./EnvironmentManager";

function createCanvas (document, containerElement) {
  const canvas = document.createElement("canvas");
  containerElement.prepend(canvas);
  return canvas;
}

class ThreeEntry {
  constructor (container) {
    this.canvas = createCanvas(document, container);
    this.sceneManager = SceneManager(this.canvas);
    this.environmentManager = EnvironmentManager();
    this.frames = 0;
    this.fpsCounter = setInterval(() => {
      //console.log(this.frames);
      this.resizeCanvas();
      this.frames = 0;
    }, 1000);
    this.bindEventListeners();
    this.render();
  }

  bindEventListeners = () => {
    window.onresize = this.resizeCanvas;
    document.addEventListener(
      "mousemove",
      this.sceneManager.onDocumentMouseMove,
      true
    );
    document.addEventListener(
      "click",
      this.sceneManager.onDocumentMouseClick,
      false
    );
    this.resizeCanvas();
  }

  resizeCanvas = () => {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.sceneManager.onWindowResize();
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.sceneManager.update();
    this.frames++;
  }
}

export default ThreeEntry;
