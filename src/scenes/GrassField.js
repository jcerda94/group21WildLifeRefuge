import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import {getEnvironmentManager} from "./EnvironmentManager";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

export const TYPE = "Grass";
//var grassMesh;
async function GrassField (config) {
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = config.onLoad || (() => null);

  const loader = new THREE.GLTFLoader(loadingManager);

  const { count = 500 } = config;

  const grasses = new THREE.Object3D();
  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      "models/grass.gltf",
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });

  const SceneManager = getSceneManager();
  const env = getEnvironmentManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  for (let i = 0; i < count; i++) {
    const grass = originalGrass.clone();
    grass.children[0].children[0].userData = {
      selectable: true,
      eatable: true,
      color: {
        highlight: "#FFF",
        original: "#3baa5d",
        selected: "#FF00FF"
      }
    };
    const size = random(1, 2);

    const x = random(-widthBound, widthBound);
    const z = random(-heightBound, heightBound);

    const rotation = random(-Math.PI / 2, Math.PI / 2);

    grass.scale.set(size, size, size);
    grass.position.set(x, 0, z);
    grass.rotation.y = rotation;
    const grassMesh = grass.children[0].children[0].material;
    grassMesh.color.set(grass.children[0].children[0].userData.color.original);
    grass.children[0].children[0].material = grassMesh.clone();//grass.children[0].children[0].userData.original; //"#3baa5d";//grassMesh.clone();
    grasses.add(grass);

    grass.type = "Grass";
    env.registerTrackedObject(grass);
  }

  grasses.type = TYPE;
  grasses.name = "grass";
  function resetCorlor() {
    //grassMesh.color.set(grass.children[0].children[0].userData.color.origin);

  }

  //console.log("grassField has   " + grasses.children.length + " children");
  function update () {}

  return {
    update,
    model: grasses,
    created: new Date()
  };
}

export default GrassField;
