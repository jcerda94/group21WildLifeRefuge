import * as THREE from "three";
import { OrbitControls } from "../js/three/OrbitControls";
import Ground from "./Ground";
import GrassField from "./GrassField";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import ThreeEntry from "./ThreeEntry";

class SceneManager {
  groundSize = {
    x: 1000,
    y: 1000
  };
  camera = null;
  scene = null;
  renderer = null;
  cameraControls = null;
  clock = new THREE.Clock();
  screenDimensions = {};
  subjects = [];

  constructor(canvas) {
    this.setCanvas(canvas);
    this.initializeScene();
    this.initializeRenderer();
    this.initializeCamera();

    this.createSceneSubjects();
  }

  setCanvas(canvas) {
    const { width, height } = canvas;
    this.canvas = canvas;
    this.screenDimensions = { width, height };
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    for (let i = 0; i < this.subjects.length; i++) {
      this.subjects[i].update && this.subjects[i].update(elapsedTime);
    }
    this.cameraControls.update();
    this.renderer.render(this.scene, this.camera);
  }

  rotateCamera(elapsedTime) {
    this.camera.position.x = 120 * Math.cos(elapsedTime / 8);
    this.camera.position.z = 120 * Math.sin(elapsedTime / 8);
    this.camera.lookAt(this.scene.position);
  }

  createSceneSubjects() {
    this.subjects = [
      new Ground(this.scene, { size: this.groundSize, color: "#996600" }),
      new GrassField(this.scene, { count: 500 }),
      new AmbientLight(this.scene),
      new DirectionalLight(this.scene)
    ];
  }

  addObject(sceneObject, position) {
    this.subjects.push(sceneObject);
    this.scene.add(sceneObject);
  }

  onWindowResize() {
    const { width, height } = this.canvas;

    this.screenDimensions.width = width;
    this.screenDimensions.height = height;

    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  initializeCamera() {
    const { width, height } = this.screenDimensions;
    const fieldOfView = 60;
    const aspectRatio = width / height;
    const nearPlane = 1;
    const farPlane = 1000;

    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    this.camera.position.set(0, 75, 100);

    this.cameraControls = new OrbitControls(this.camera);
  }

  initializeScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ffffff");
  }

  setCameraPostion(x,y,z){

    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
  }

  initializeRenderer() {
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

export default function(container) {
  if (!SceneManager.instance) {
    SceneManager.instance = new SceneManager(container);
  }
  return SceneManager.instance;
}
