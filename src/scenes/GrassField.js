import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

async function GrassField (scene, config = { count: 500 }) {
  const loader = new THREE.GLTFLoader();
  const { count } = config;

  const grasses = new THREE.Object3D();
  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      "models/grass.gltf",
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });
  const bounds = getSceneManager().groundSize;
  bounds.x *= 0.95;
  bounds.y *= 0.95;

  for (let i = 0; i < count; i++) {
    const grass = originalGrass.clone();
    grass.children[0].children[0].userData = {
      selectable: true,
      color: {
        highlight: "#FFF",
        original: "#3baa5d",
        selected: "#FF00FF"
      }
    };
    const size = random(1, 2);

    const x = random(-bounds.x / 2, bounds.x / 2);
    const z = random(-bounds.y / 2, bounds.y / 2);

    const rotation = random(-Math.PI / 2, Math.PI / 2);

    grass.scale.set(size, size, size);
    grass.position.set(x, 0, z);
    grass.rotation.y = rotation;
    const grassMesh = grass.children[0].children[0].material;
    grassMesh.color.set(grass.children[0].children[0].userData.color.original);
    grass.children[0].children[0].material = grassMesh.clone();
    grasses.add(grass);
  }

  grasses.type = "Grass";

  scene.add(grasses);

  function update () {}

  return {
    update
  };
}

export default GrassField;
