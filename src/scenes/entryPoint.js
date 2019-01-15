import SceneManager from "./SceneManager";

function createCanvas(document, containerElement) {
  const canvas = document.createElement("canvas");
  containerElement.appendChild(canvas);
  return canvas;
}

function entryPoint(containerElement) {
  const canvas = createCanvas(document, containerElement);
  const sceneManager = new SceneManager(canvas);

  bindEventListeners();
  render();

  function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
  }

  function resizeCanvas() {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    sceneManager.onWindowResize();
  }

  function render() {
    requestAnimationFrame(render);
    sceneManager.update();
  }
}

export default entryPoint;
