import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { random } from "../utils/helpers";
const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var TWEEN = require("@tweenjs/tween.js");

function Hawk (config) {
  let ate = false;
  const size = 3;
  const color = "#db7093";

  // create a sphere or a hare
  const sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  const hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  hareMesh.name = "attachedHare";

  const geometry = new THREE.CubeGeometry(size, size * 5, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  var hawk = new THREE.Group();
  hawk.receiveShadow = false;
  hawk.castShadow = false;
  hareMesh.position.y = hawk.position.y - 5;
  cube.position.y = hawk.position.y;
  hawk.add(cube);
  // hawk.add(hareMesh);
  hawk.userData = {
    selectable: true,
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };
  hawk.name = NAME;
  hawk.type = TYPE;

  const SceneManager = getSceneManager();

  const randomX = () => {
    const groundX = SceneManager.groundSize.x / 2;
    return random(-groundX, groundX);
  };

  const randomZ = () => {
    const groundZ = SceneManager.groundSize.y / 2;
    return random(-groundZ, groundZ);
  };

  hawk.position.x = randomX();
  hawk.position.z = randomZ();
  hawk.position.y = 100;

  const tween1 = new TWEEN.Tween(hawk.position).to(
    { x: randomX(), y: 100, z: randomZ() },
    10000
  );

  const tween2 = new TWEEN.Tween(hawk.position).to(
    { x: randomX(), y: 100, z: randomZ() },
    10000
  );

  var tween3 = new TWEEN.Tween(hawk.position)
    .to({ x: randomX(), y: 50, z: randomZ() }, 10000)
    .start();

  // hawk must track it's position and look for hares nearby as it flys
  getHawkObserver().subscribe(position => {
    // console.log("hawkObserver method called for Hawk: ");
  });
  function checkForHare () {
    if (!ate) {
      const subjects = getSceneManager().subjects;
      for (let i = 4; i < subjects.length; i++) {
        // console.log("Hawk:checkForHare:  length : " + subjects.length );
        if (subjects.length > 4) {
          if (subjects[i].model.name === "hare") {
            // console.log(" Found a hare: " + position.x + ":" + position.y + ":" + position.z);
            // JWC  tween3 = new TWEEN.Tween(cube.position)
            tween3 = new TWEEN.Tween(hawk.position).to(
              {
                x: subjects[i].model.position.x,
                y: subjects[i].model.position.y,
                z: subjects[i].model.position.z
              },
              10000
            );

            tween2.chain(tween3);
            tween3.chain(tween1);
          }
        }
      }
    } else {
      // hareMesh.position.y = hawk.position.y - 4;
      // cube.position.y = hawk.position.y;
    }
  }
  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween1);
  var count = 1;

  const hunger = 0;

  function get2DPosition () {
    SceneManager.camera.updateProjectionMatrix();
    const vector = hawk.position.clone().project(SceneManager.camera);
    vector.x = ((vector.x + 1) / 2) * SceneManager.screenDimensions.width - 14;
    vector.y = (-(vector.y - 1) / 2) * SceneManager.screenDimensions.height;
    return vector;
  }

  function addLabel () {
    const hungerValue = document.createElement("div");
    hungerValue.style.position = "absolute";
    hungerValue.style.width = "60px";

    hungerValue.style.backgroundColor = "#30303080";
    hungerValue.style.color = "#FFFFFF";
    hungerValue.innerHTML = `Hunger\n${hunger}`;

    const pos = get2DPosition();
    hungerValue.style.top = pos.y + "px";
    hungerValue.style.left = pos.x + "px";
    document.body.appendChild(hungerValue);
    function updatePosition (x, y) {
      hungerValue.style.top = `${y}px`;
      hungerValue.style.left = `${x}px`;
    }
    return {
      updatePosition
    };
  }

  const hungerValue = addLabel();

  function update (elapsedTime) {
    count++;
    const position = get2DPosition();
    hungerValue.updatePosition(position.x, position.y);
    // console.log("hawk updated: " + count++);

    // The updates happen very often for small position changes
    // This made the hawk behave erratically.
    // The observers probably don't care if the hawk moves a small distance
    // May want to make this delta-position based.
    // for now just scale back the number of times the position is reported to the other animals.
    if (count % 30 === 0) getHawkObserver().broadcast();

    checkForHare();
    TWEEN.update();
    checkForHare();
  }

  function handleCollision (targets) {
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].object.type === "Hare") {
        // added a hare when collision occur
        hawk.add(hareMesh);
        ate = true;
        SceneManager.removeObject(targets[i].object);
      }
    }
  }

  return {
    update,
    model: hawk,
    created: new Date(),
    handleCollision
  };
}
export default Hawk;
