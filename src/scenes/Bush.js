import { getCapiInstance } from "../utils/CAPI/capi";
import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
const THREE = require("three");

export const NAME = "bush";
export const TYPE = "Bush";

function Bush (scene) {

  const size = 5;
  const color = "#2cdb26";

  const geometry = new THREE.CubeGeometry(size * 3, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  const x = random(-widthBound, widthBound);
  const y = 1.5;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  cube.position.set(position.x, position.y, position.z);
  cube.userData = {
    selectable: true,
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };

  cube.type = TYPE;
  cube.name = NAME;
  scene.add(cube);

  function update () {}

  return {
    update,
    model: cube,
    created: new Date()
  };

}

export default Bush;
