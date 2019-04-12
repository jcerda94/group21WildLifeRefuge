import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { Node } from "../utils/LinkedList.js";
import { getGrassLinkedList } from "../utils/LinkedList.js";
import {getEnvironmentManager} from "./EnvironmentManager";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

export const TYPE = "Grass";
async function GrassField (config) {
  const loadingManager = new THREE.LoadingManager();

  const loader = new THREE.GLTFLoader(loadingManager);

  const { grasses: count } = config;

  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      "models/grass.gltf",
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });

  const bounds = getSceneManager().groundSize;
  const positionBound = {
    x: bounds.x * 0.95,
    y: bounds.y * 0.95
  };

  const grassModels = [];


  for (let i = 0; i < count; i++) {
    const grass = originalGrass.clone();
    grass.children[0].children[0].userData = {
      selectable: true,
      gender: "not available",
      eatable: true,
      color: {
        highlight: "#FFF",
        original: "#3baa5d",
        selected: "#FF00FF"
      }
    };
    const size = random(2, 5);

    const x = random(-positionBound.x / 2, positionBound.x / 2);
    const z = random(-positionBound.y / 2, positionBound.y / 2);

    const rotation = random(-Math.PI / 2, Math.PI / 2);

    grass.scale.set(size, size, size);

    grass.position.set(x, 0, z);

    grass.rotation.y = rotation;
    const grassMesh = grass.children[0].children[0].material;
    grassMesh.color.set(grass.children[0].children[0].userData.color.original);
    grass.children[0].children[0].material = grassMesh.clone();
    grass.type = TYPE;
    grass.name = "grass";
    getEnvironmentManager().registerTrackedObject(grass);


    const onDestroy = () => {
      getEnvironmentManager().onDeath(grass);
    };

    grassModels.push({
      update,
      onDestroy,
      model: grass,
      created: new Date(0)
    });
  }

  config.onLoad && config.onLoad();
  function update () {}
  return grassModels;
}

export default GrassField;
