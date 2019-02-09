import * as THREE from "three";
import { OrbitControls } from "../js/three/OrbitControls";
import Ground from "./Ground";
import GrassField from "./GrassField";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import { getValue } from "../utils/helpers";
import Hawk, { NAME as hawkName } from "./Hawk";
import { getCapiInstance } from "../utils/CAPI/capi";
import { FlyControls } from "../js/three/FlyControls";

class SceneManager {
  groundSize = {
    x: 1000,
    y: 1000
  }
  camera = null
  scene = null
  renderer = null
  cameraControls = null
  loaded = false
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  clock = new THREE.Clock()
  screenDimensions = {}
  subjects = []
  selected = []
  intersected = null
  defaultCameraPosition = [-75, 40, 80]
  loadingScreen = null

  constructor (canvas) {
    this.setCanvas(canvas);
    this.initializeLoadingScreen();
    this.initializeScene();
    this.initializeRenderer();
    this.initializeCamera();

    this.createSceneSubjects();
  }

  initializeLoadingScreen () {
    const { width, height } = this.screenDimensions;
    const aspectRatio = width / height;
    this.loadingScreen = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 100),
      indicator: new THREE.Mesh(
        new THREE.CircleGeometry(1, 32),
        new THREE.MeshBasicMaterial({
          color: "#3f51b5",
          side: THREE.DoubleSide
        })
      )
    };
    this.loadingScreen.scene.background = new THREE.Color("#FFFFFF");
    this.loadingScreen.indicator.position.set(0, 0, 5);
    this.loadingScreen.camera.lookAt(this.loadingScreen.indicator.position);
    this.loadingScreen.scene.add(this.loadingScreen.indicator);
  }

  setCanvas (canvas) {
    const { width, height } = canvas;
    this.canvas = canvas;
    this.screenDimensions = { width, height };
  }

  onLoad = () => {
    this.loaded = true;
  }

  resetCamera () {
    this.cameraControls.reset();
  }

  toggleSelected (model) {
    const modelIndex = this.selected.findIndex(
      selectedModel => model === selectedModel
    );

    if (modelIndex >= 0) {
      const modelToRemove = this.selected[modelIndex];
      const originalColor = getValue("userData.color.original", modelToRemove);

      const color = getValue("material.color", modelToRemove);
      color.set && color.set(originalColor);
      if (getValue("userData.name") === hawkName) {
        const capi = getCapiInstance();
        const currentHawkCount = capi.getValue({ key: "redtailHawkSelected" });
        capi.setValue({
          key: "redtailHawkSelected",
          value: currentHawkCount - 1
        });
      }
      this.selected.splice(modelIndex, 1);
    } else {
      const color = getValue("material.color", model);
      const selectedColor = getValue("userData.color.selected", model);
      const name = getValue("userData.name", model);
      color.set && color.set(selectedColor);
      if (name === hawkName) {
        const capi = getCapiInstance();
        const currentHawkCount = capi.getValue({ key: "redtailHawkSelected" });
        capi.setValue({
          key: "redtailHawkSelected",
          value: currentHawkCount + 1
        });
      }
      this.selected.push(model);
    }
  }

  update () {
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    for (let i = 0; i < this.subjects.length; i++) {
      this.subjects[i].update && this.subjects[i].update(elapsedTime);
    }

    this.cameraControls.update(delta);
    if (!this.loaded) {
      this.renderer.render(this.loadingScreen.scene, this.loadingScreen.camera);
      return;
    }
    this.renderer.render(this.scene, this.camera);
    this.checkIntersects();
  }

  checkIntersects = () => {
    const intersects =
      this.raycaster.intersectObjects(this.scene.children, true) || [];

    if (intersects.length > 0) {
      if (this.intersected !== intersects[0].object) {
        this.resetIntersectedColor(this.intersected);
        this.intersected = getValue("object", intersects[0]);

        const selectable = getValue("userData.selectable", this.intersected);
        if (selectable) {
          const highlight = getValue(
            "userData.color.highlight",
            this.intersected
          );
          const color = getValue("material.color", this.intersected);
          color.set && color.set(highlight);
        }
      }
    } else {
      this.resetIntersectedColor(this.intersected);
      this.intersected = null;
    }
  }

  resetIntersectedColor (intersected) {
    const selectableKey = "userData.selectable";
    if (intersected && getValue(selectableKey, intersected)) {
      const color = getValue("material.color", intersected);
      const isSelected =
        this.selected.findIndex(model => model === intersected) >= 0;

      if (color.set) {
        const colorKey = `userData.color.${
          isSelected ? "selected" : "original"
        }`;
        color.set(getValue(colorKey, intersected));
      }
    }
  }

  createSceneSubjects () {
    this.subjects = [
      new AmbientLight(this.scene),
      new DirectionalLight(this.scene),
      new Ground(this.scene, { size: this.groundSize, color: "#996600" }),
      new GrassField(this.scene, { count: 500 }, this.onLoad)
    ];
  }

  addObject (sceneObject) {
    this.subjects.push(sceneObject);
  }

  removeObject (idx, sceneObject) {
    //console.log("removeObject: sceneObject: " + idx);
    this.subjects.splice(idx, 1);
    this.scene.remove(sceneObject);
  }

  
  onTransporterReady () {
    const capi = getCapiInstance();
    const hawkCount = capi.getValue({ key: "redtailHawkCount" });

    for (let hawks = 0; hawks < hawkCount; hawks++) {
      this.addObject(new Hawk(this.scene));
    }
  }

  onWindowResize () {
    const { width, height } = this.canvas;

    this.screenDimensions.width = width;
    this.screenDimensions.height = height;

    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  handleClick = event => {
    const vector = this.convertClickToVector(event);
    this.raycaster.set(this.camera.position, vector);
    const intersects =
      this.raycaster.intersectObjects(this.scene.children, true) || [];

    const model = intersects[0] || {};
    const isSelectable = !!getValue("object.userData.selectable", model);

    if (isSelectable) {
      this.toggleSelected(model.object);
    }
  }

  convertClickToVector = event => {
    const vector = new THREE.Vector3();
    const canvasTopOffset = this.canvas.getBoundingClientRect().top;
    vector.x = (event.clientX / this.canvas.width) * 2 - 1;
    vector.y = (-(event.clientY - canvasTopOffset) / this.canvas.height) * 2 + 1;

    vector.unproject(this.camera);
    vector.sub(this.camera.position);
    vector.normalize();
    return vector;
  }

  onDocumentMouseClick = event => {
    this.handleClick(event);
  }

  onDocumentMouseMove = event => {
    const vector = this.convertClickToVector(event);
    this.raycaster.set(this.camera.position, vector);
  }

  initializeCamera () {
    const { width, height } = this.screenDimensions;
    const fieldOfView = 60;
    const aspectRatio = width / height;
    const nearPlane = 1;
    const farPlane = 4000;

    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    this.camera.position.set(...this.defaultCameraPosition);

    this.cameraControls = new OrbitControls(this.camera);
  }

  setFlyControlCamera () {
    // position and point the camera to the center of the scene
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 300;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.cameraControls = new FlyControls(this.camera);

    this.cameraControls.movementSpeed = 25;
    this.cameraControls.domElement = document.querySelector("#root");
    this.cameraControls.maxPolarAngle = Math.PI * 0.5;
    this.cameraControls.rollSpeed = Math.PI / 24;
    this.cameraControls.autoForward = true;
    this.cameraControls.dragToLook = true;
  }

  setCameraPosition (x, y, z) {
    this.cameraControls = new OrbitControls(this.camera);

    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
  }

  setDefaultCamera () {
    this.camera.position.set(...this.defaultCameraPosition);
  }

  initializeScene () {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ffffff");
  }

  initializeRenderer () {
    const { width, height } = this.screenDimensions;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height);
  }
}

export const getSceneManager = () => {
  return SceneManager.instance || null;
};

export default function (container) {
  if (!SceneManager.instance) {
    SceneManager.instance = new SceneManager(container);
  }
  return SceneManager.instance;
}
