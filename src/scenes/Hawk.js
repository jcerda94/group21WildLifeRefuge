import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var TWEEN = require("@tweenjs/tween.js");

function Hawk () {
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
    10000/3
  );

  const tween2 = new TWEEN.Tween(cube.position)
    .to({ x: -500, y: 100, z: 100 }, 10000/3)
    .start();

  var tween3 = {};

  // hawk must track it's position and look for hares nearby as it flys
  getHawkObserver().subscribe(position => {
    // console.log("hawkObserver method called for Hawk: ");
    //checkForHare(position);
  });

  function checkForHare () {
    for (let i = 4; i < getSceneManager().subjects.length; i++) {
      // console.log("Hawk:checkForHare:  length : " + getSceneManager().subjects.length );
      if (getSceneManager().subjects.length > 4) {
        if (getSceneManager().subjects[i].model.name == "hare") {
          // console.log(" Found a hare: " + position.x + ":" + position.y + ":" + position.z);
          // JWC  tween3 = new TWEEN.Tween(cube.position)
          tween3 = new TWEEN.Tween(cube.position).to(
            {
              x: getSceneManager().subjects[i].model.position.x,
              y: getSceneManager().subjects[i].model.position.y,
              z: getSceneManager().subjects[i].model.position.z
            },
            10000/4
          );
          tween2.chain(tween3);
          tween3.chain(tween1);
        }
      }
    }
  }
  tween1.chain(tween2);
  tween2.chain(tween1);

  function update () {
    // console.log("hawk updated");
    // get the position and then it should call the observers
    checkForHare();
    getHawkObserver().broadcast(cube.position);
    TWEEN.update();
  }

  return {
    update,
    model: cube,
    created: new Date()
  };
}

export default Hawk;
