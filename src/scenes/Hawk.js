import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var TWEEN = require("@tweenjs/tween.js");

function Hawk () {
  console.log("Added another Hawk");
  const size = 3;
  const color = "#db7093";

  const geometry = new THREE.CubeGeometry(size, size * 5, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  const x = random(-widthBound, widthBound);
  const y = 100;
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
  cube.name = NAME;

  cube.type = TYPE;

  const tween1 = new TWEEN.Tween(cube.position).to(
    { x: 500, y: 100, z: -100 },
    10000
  );

  const tween2 = new TWEEN.Tween(cube.position).to(
    { x: -500, y: 100, z: 100 },
    10000
  );

  const tween3 = new TWEEN.Tween(cube.position)
    .to({ x: -100, y: 0, z: -100 }, 10000)
    .start();

  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween1);
  function update () {
    // console.log("I am updated");
    TWEEN.update();
  }

  return {
    update,
    model: cube,
    created: new Date()
  };
}

export default Hawk;
