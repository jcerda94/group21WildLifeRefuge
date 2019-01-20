import SceneManager from "./SceneManager";

function createCanvas(document, containerElement) {
  const canvas = document.createElement("canvas");
  containerElement.prepend(canvas);
  return canvas;
}

class ThreeEntry {
  constructor(container) {
    this.canvas = createCanvas(document, container);
    this.sceneManager = SceneManager(this.canvas);
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
    this.resizeCanvas();
  };

  resizeCanvas = () => {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.sceneManager.onWindowResize();
  };

  render = () => {
    requestAnimationFrame(this.render);
    this.sceneManager.update();
  };
}

export default ThreeEntry;
