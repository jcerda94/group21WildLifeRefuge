import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { Node } from "../utils/LinkedList.js";
import { getGrassLinkedList } from "../utils/LinkedList.js";
import {getEnvironmentManager} from "./EnvironmentManager";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

export const TYPE = "Grass";
async function TargetedGrassField (config) {
  const loadingManager = new THREE.LoadingManager();

  const loader = new THREE.GLTFLoader(loadingManager);

  const { coords: targets } = config;

  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      "models/grass.gltf",
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });


  const grassModels = [];


  for (let i = 0; i < targets.length; i++) {
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

    const x = targets[i].x;
    const z = targets[i].y;

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

export default TargetedGrassField;
