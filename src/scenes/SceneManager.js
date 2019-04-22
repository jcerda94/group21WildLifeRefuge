import * as THREE from "three";
import { OrbitControls } from "../js/three/OrbitControls";
import { getValue } from "../utils/helpers";
import { NAME as hawkName } from "./Hawk";
import { getCapiInstance } from "../utils/CAPI/capi";
import { FlyControls } from "../js/three/FlyControls";
import PreLoadModels from "./PreLoadModels";
import { getPopUpInfo } from "../components/PopUpInfo";
import ModelFactory from "./ModelFactory";
import capiModel from "../model/capiModel";
import Subject from "../utils/subject";
import AddModelsBasedOnSimTime from "./AddModelsBasedOnSimTime";
import { getEnvironmentManager } from "./EnvironmentManager";

class SceneManager {
  // Controls size of the ground, which is centered at 0, 0
  // Actual coordinates are x and z, since y is up
  groundSize = {
    x: 1000,
    y: 1000
  }

  // ThreeJS references for various entities
  camera = null
  scene = null
  renderer = null
  cameraControls = null

  // Whether async loading of models is done
  loaded = false

  // Raycaster for doing collision detection and mouseover highlighting
  raycaster = new THREE.Raycaster()

  mouse = new THREE.Vector2()
  clock = new THREE.Clock()

  // How big the user's screen is
  screenDimensions = {}

  // An array of objects representing a sceneSubject, each of which contains some sort of model key
  subjects = []

  // Which items are selected
  selected = []

  // Currently intersected model (closest to camera's plane)
  intersected = null

  defaultCameraPosition = [0, 40, 400]
  loadingScreen = null
  ready = false
  modelsPreloaded = false

  // Whether the simulation (business logic and time elapsing) is paused
  isPaused = false

  // Current seconds in simulation time, this advances faster than clock time based on the timeScale selected
  simulationElapsedTime = 0
  currentTimeScale = "hours"
  timeScale = {
    minutes: 60,
    hours: 60 * 60,
    days: 24 * 60 * 60,
    months: 30 * 24 * 60 * 60,
    years: 365 * 24 * 60 * 60
  }

  constructor (canvas) {
    this.setCanvas(canvas);
    this.initializeLoadingScreen();
    this.initializeScene();
    this.initializeRenderer();
    this.initializeCamera();
    this.initializeSimEvents();
  }

  /**
   * These two Subject events are used to broadcast that the simulation is paused
   * or has resumed. Models are responsible for subscribing to this event in order
   * to respond to the pause and play behavior and stop animating. Animations are
   * run in the background and will continue even when the debugger has the application
   * paused
   */
  initializeSimEvents () {
    Subject.subscribe("pause_simulation", this.pauseSimulation);
    Subject.subscribe("resume_simulation", this.resumeSimulation);
  }

  /**
   * Since models are loaded from files, which is done asynchronously, this
   * loading "screen" is the first thing displayed to users before the models
   * are ready to go. It can be modified to be any ThreeJS scene as long as it doesn't
   * also need to load models.
   */
  initializeLoadingScreen () {
    const { width, height } = this.screenDimensions;
    const aspectRatio = width / height;

    this.loadingScreen = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000),
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

  /**
   * This sets the canvas element for drawing by ThreeJS. The canvas size is also used
   * as the user's screen dimensions.
   * @param {HTMLCanvasElement} canvas The canvas element ThreeJS will use to render to
   */
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

  /**
   * This function was written early on as a way to integrate with capi and count the number of items
   * selected. It turned out to not be too useful but its here as an example of one way to get this done.
   *
   * @param {THREE.Object3D} model This is the model being selected by the user with an event
   * such as a touch or click.
   */
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

  /**
   * Broadcasts an event with data attached to let the UI know there's an updated sim time to display.
   * This is the primary driver for the simulation time component in React's UI.
   * @param {Number} elapsedTime seconds elapsed since the start of the simulation
   * @param {Number} simTime accelerated seconds elapsed since the start of the simulation
   */
  updateDisplayTime (elapsedTime, simTime) {
    Subject.next("update_sim_time", { elapsedTime, simTime });
  }

  /**
   * Returns the sim time in the unit requested. Must be one of the simTimeScale units to be used.
   * This function rounds down, since elapsed time hasn't elapsed unless its through to the next
   * discrete value. For example, 1.7 days is 1 day elapsed.
   *
   * @param {String} param0 The object must have a unit key that's used to get what the sim
   * time would be for a given unit.
   */
  getElapsedSimTime ({ unit } = { unit: "seconds" }) {
    if (unit === "seconds") return this.simulationElapsedTime;

    const conversionFactor = this.timeScale[unit];
    if (!conversionFactor) return this.simulationElapsedTime;

    return Math.floor(this.simulationElapsedTime / conversionFactor);
  }

  /**
   * The update loop, this runs on every animation frame. Not guaranteed to be 60 fps.
   * If the simulation is paused it will only update the models' label positions, camera
   * controls, and continue elapsing time. If the SceneManager hasn't loaded yet this will
   * display the loading scene instead of the simulation scene.
   *
   * If all is good, this calls update() on every object in this.subjects, which means every
   * object in that array should provide an update function.
   */
  update () {
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    const simTimeScale = this.timeScale[this.currentTimeScale] || 1;
    if (this.isPaused) {
      this.renderer.render(this.scene, this.camera);
      this.cameraControls.update(delta);
      this.subjects.forEach(subject => {
        if (subject.updateLabelPosition) {
          subject.updateLabelPosition();
        }
      });
      return;
    }

    this.simulationElapsedTime += delta * simTimeScale;
    this.updateDisplayTime(elapsedTime, this.simulationElapsedTime);

    for (let i = 0; i < this.subjects.length; i++) {
      this.subjects[i].update &&
        this.subjects[i].update(elapsedTime, this.simulationElapsedTime);
    }

    if (!this.loaded) {
      this.renderer.render(this.loadingScreen.scene, this.loadingScreen.camera);
      return;
    }

    this.renderer.render(this.scene, this.camera);
    this.checkIntersects();
    getEnvironmentManager().update();

    if (!this.modelsPreloaded) {
      this.modelsPreloaded = true;
      const capi = getCapiInstance();
      const [hawks, hares, cedars, bushes] = capi.getValues({
        keys: [
          "SimCount.redtailHawkCount",
          "SimCount.snowshoeHareCount",
          "SimCount.westernCedarCount",
          "SimCount.sageBushCount"
        ]
      });
      PreLoadModels({ hawks, hares, cedars, bushes });
    }
  }

  /**
   * This function uses basic raycasting to check whether the mouse has intersected with a model.
   * The ray intersects all models in a line but only the first one is used since that's the closest
   * model to the camera (and the one the user is probably trying to click on).
   */
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

  /**
   * Turns a models color back to its original color. This is a limited implementation.
   * Something like a solid outline or a glow effect would be better than changing the \
   * color of a model.
   */
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

  /**
   * Adds the initial sceneSubjects to the subjects array and adds them to the
   * ThreeJS scene.
   */
  async createSceneSubjects () {
    let grassCount = getCapiInstance().getValue({ key: "SimCount.grass" });
    if (grassCount === null || grassCount === undefined) grassCount = 100;
    const grassField = await ModelFactory.makeSceneObject({
      type: "grassField",
      config: {
        onLoad: this.onLoad,
        grasses: grassCount
      }
    });

    this.subjects = [
      ModelFactory.makeSceneObject({ type: "ambientLight" }),
      ModelFactory.makeSceneObject({ type: "directionalLight" }),
      ModelFactory.makeSceneObject({ type: "spotLight" }),
      ModelFactory.makeSceneObject({
        type: "ground",
        config: { size: this.groundSize, color: "#996600" }
      }),
      ...grassField,
      ...this.subjects
    ];

    this.subjects.forEach(subject => {
      this.scene.add(subject.model);
    });

    // Notifies EnvironmentManager that the ground can be drawn on
    this.ready = true;
  }

  /**
   * The SceneManager will add this object to the scene at whatever position the model says it should be at.
   * It will also add it to the subjects array and begin calling its update function during the update loop.
   *
   * @param {SceneObject} sceneObject The object that should be added to the scene. This should have a model key on it.
   */
  addObject (sceneObject) {
    this.subjects.push(sceneObject);
    this.scene.add(sceneObject.model);
  }

  /**
   * This is just a convenient method to add, for instance, 15 hawks to the scene. You would call
   * SceneManager.addObjects({ type: "hawk", config: {yourconfig}, count: 15 }). The objects will
   * spawn in whatever location their constructor asks them to.
   *
   * @param {Object} param0 The type, count, and configuration of a fixed number of objects to add.
   */
  addObjects ({ type, config, count }) {
    for (let i = 0; i < count; i++) {
      this.addObject(
        ModelFactory.makeSceneObject({
          type,
          config
        })
      );
    }
  }

  /**
   * Returns all subjects with a matching id, which is usually a UUID. This
   * can return multiple objects, or none.
   *
   * @param {Object} param0 Object with an id key to compare subjects to
   */
  getSceneObjectByID ({ id }) {
    return this.subjects.find(child => child.model.uuid === id);
  }

  /**
   * Returns all objects in the scene with the given type(s)
   * SceneManager.getSceneObjectsOf({ types: ["Grass", "Hare"] }) would return
   * all grass and hares in the scene.
   *
   * @param {Object} param0 An object with a types key, an array of types to return
   */
  getSceneObjectsOf ({ types }) {
    return this.scene.children.filter(child => types.includes(child.type));
  }

  /**
   * Returns a boolean as true if the scene has a model with the given ID, false otherwise.
   * This is used to make sure animals targeting food still have a valid target as they approach the food.
   * @param {Object} param0 Object with an id key to compare subjects to
   * @returns {Boolean}
   */
  hasSceneObject ({ id }) {
    return this.subjects.some(subject => subject.model.uuid === id);
  }

  /**
   * This will remove a specific object from the scene, such as the food a hare was just eating.
   *
   * @param {String} id The UUID of the object to remove from the scene.
   */
  removeObjectByUUID (id) {
    const target = this.subjects.find(subject => subject.model.uuid === id);
    if (!target) return;
    this.removeObject(target.model);
  }

  /**
   * Removes the subject from the subjects array and the scene, and calls its onDestroy function
   * upon removal. This does a UUID comparison to match the UUID of the provided object with a matching
   * object in the subjects array.
   *
   * @param {Object} sceneObject The subject to remove from the subjects array
   */
  removeObject (sceneObject) {
    this.subjects = this.subjects.filter(subject => {
      const targetSubject = subject.model.uuid === sceneObject.uuid;
      if (targetSubject) {
        subject.onDestroy && subject.onDestroy();
      }

      return !targetSubject;
    });
    sceneObject.onDestroy && sceneObject.onDestroy();
    this.scene.remove(sceneObject);
  }

  /**
   * Removes all models on screen that match the given type. If you wanted all
   * grass removed you'd call SceneManager.removeAllModelsByType('Grass')
   *
   * @param {String} type The provided model type to remove from the scene.
   */
  removeAllModelsByType (type) {
    const modelsToRemove = this.subjects
      .filter(subject => {
        if (subject.model && subject.model.type === type) {
          subject.onDestroy && subject.onDestroy();
          return true;
        }
        return false;
      })
      .map(({ model }) => model);

    this.subjects = this.subjects.filter(subject => {
      if (subject.model) {
        return subject.model.type !== type;
      }
      return true;
    });
    modelsToRemove.forEach(model => this.scene.remove(model));
  }

  /**
   * Turns the label on and off. This is the listener for label visibility in smart sparrow
   */
  toggleLabelFor = ({ type, labelName }) => capiModel => {
    this.subjects.forEach(subject => {
      if (subject.model && subject.model.type === type) {
        subject.setLabelTo &&
          subject.setLabelTo({
            visible: capiModel.get(labelName)
          });
      }
    });
  }

  /**
   * Stops the ThreeJS clock and fires a simulation paused event for other
   * objects to respond to
   */
  pauseSimulation = () => {
    this.isPaused = true;
    this.clock.stop();
    Subject.next("simulation_paused");
  }

  /**
   * Continues running the ThreeJS Clock and fires a simulation resumed event
   * for other objects to respond to
   */
  resumeSimulation = () => {
    this.isPaused = false;
    this.clock.start();
    Subject.next("simulation_resumed");
  }

  /**
   * This is the callback used to indicate that smart sparrow is ready to communicate with
   * this application.
   */
  onTransporterReady () {
    const capi = getCapiInstance();
    this.createSceneSubjects();

    // Finds keys in our capiModel.json file that are prefixed with 'env.'
    const envKeys = Object.keys(capiModel).filter(key => key.includes("env."));

    // The values for the above keys are retrieved from capi and the key value pairs are combined into one object.
    // That object is then passed to the environment manager to initialize the local env.
    const envParams = capi.getValues({
      keys: [...envKeys]
    });

    // The keys have the 'env.' prefix removed before being sent to the environment manager, so they will no longer
    // have the same variable name in the capi model. Accordingly these values should only be used for initialization of
    // the environment, not for dynamic simulation adjustments.
    getEnvironmentManager().initializeEnvironmentWithParams(
      envKeys.reduce(
        (o, key, idx) => ({ ...o, [key.substr(4)]: envParams[idx] }),
        {}
      )
    );
  }

  /**
   * Resizes the canvas if the user adjusts their window size. This works on most screen sizes,
   * though its hard to see on small devices.
   */
  onWindowResize () {
    const { width, height } = this.canvas;

    this.screenDimensions.width = width;
    this.screenDimensions.height = height;

    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  /**
   * The user clicking on the screen needs to be handled. Currently it just selects an item
   * if they click on it. However, any functionality could be put here to respond to clicks
   * and even communicate them to smart sparrow.
   */
  handleClick = event => {
    const vector = this.convertClickToVector(event);
    this.raycaster.set(this.camera.position, vector);
    const intersects =
      this.raycaster.intersectObjects(this.scene.children, true) || [];

    const model = intersects[0] || {};
    const isSelectable = !!getValue("object.userData.selectable", model);
    if (intersects.length > 1 && model.object.name !== "LowPolyGrass") {
      getPopUpInfo().popUpInfo("tree", model.object.userData.gender, event);
    }
    if (isSelectable) {
      this.toggleSelected(model.object);
      const popUpInfo = getPopUpInfo();
      popUpInfo.popUpInfo(
        model.object.name,
        model.object.userData.gender,
        event
      );
    }
  }

  /**
   * This is the opposite of projecting a set of 3d coordinates to the 2d plane of the
   * camera, its projecting a point on the camera (where the user clicked) to the corresponding point
   * in 3d space.
   */
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

  /**
   * This is the function which gets bound to the mouse click event in the browser
   */
  onDocumentMouseClick = event => {
    this.handleClick(event);
  }

  /**
   * This is run every time the mouse moves, and is bound to the mousemove even in
   * the browser.
   */
  onDocumentMouseMove = event => {
    const vector = this.convertClickToVector(event);
    this.raycaster.set(this.camera.position, vector);
  }

  /**
   * Basic camera setup, can be modified to any desired positioning or controls.
   */
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

  /**
   * This is modifying the camera controls to use FlyControls instead of
   * OrbitControls. This was part of learning how to better integrate with
   * smart sparrow.
   */
  setFlyControlCamera () {
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

  /**
   * Sets the camera to orbit controls and puts the position at the desired position.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   */
  setCameraPosition (x, y, z) {
    this.cameraControls = new OrbitControls(this.camera);

    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
  }

  /**
   * Returns the camera to its default positioning.
   */
  setDefaultCamera () {
    this.camera.position.set(...this.defaultCameraPosition);
  }

  /**
   * Creates an initial empty scene for ThreeJS to use.
   */
  initializeScene () {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ffffff");
  }

  /**
   * Initializes the renderer with the attributes from the canvas element
   * and the known screen dimensions. This needs to be called after the canvas has
   * been set.
   */
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

/**
 * This is how you get the SceneManager. JavaScript doesn't have a great way of dealing with
 * singletons. This will provide the one instantiation of the class. Since the SceneManager class
 * requires a canvas container in its constructor, this can't create one by default. Not every place
 * the SceneManager is being used can provide the constructor arguments.
 */
export const getSceneManager = () => {
  return SceneManager.instance || null;
};

/**
 * This is essentially a higher order constructor for the SceneManager. It creates the instance of SceneManager
 * and makes sure the instance is set and available for getSceneManager to return.
 *
 * @param container This is the container the canvas will be placed into.
 */
export default function (container) {
  if (!SceneManager.instance) {
    SceneManager.instance = new SceneManager(container);
  }
  return SceneManager.instance;
}
