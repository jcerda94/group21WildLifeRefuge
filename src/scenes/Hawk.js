import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { random } from "../utils/helpers";
import { hunger, label } from "../utils/behavior";
const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var numberHawks = 0;
let TWEEN = require("@tweenjs/tween.js");

function Hawk (config) {
  let ate = false;
  let isEating = false;
  let deathDelta = 0;
  const deathTimer = 60 * 60 * 24; // Eat within a day at max hunger or die
  const maxHunger = 10;
  const minHunger = 1;
  const size = 3;
  const color = "#db7093";

  // create a sphere or a hare
  const sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  const hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  hareMesh.name = "attachedHare";

  const geometry = new THREE.CubeGeometry(size, size * 5, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const hawk = new THREE.Mesh(geometry, material);

  const SceneManager = getSceneManager();

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

  var myHawkID = numberHawks++;

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
                x: getSceneManager().subjects[i].model.position.x,
                y: getSceneManager().subjects[i].model.position.y,
                z: getSceneManager().subjects[i].model.position.z
              },
              10000
            );
            tween2.chain(tween3);
            tween3.chain(tween1);
          }
        }
      }
    }
  }
  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween1);
  var count = 1;

  const hawkHunger = hunger({
    maxHunger,
    minHunger,
    hungerTickRate: random(0.00001, 0.0001)
  });

  function get2DPosition () {
    SceneManager.camera.updateProjectionMatrix();
    const vector = hawk.position.clone().project(SceneManager.camera);
    vector.x = ((vector.x + 1) / 2) * SceneManager.screenDimensions.width - 14;
    vector.y = (-(vector.y - 1) / 2) * SceneManager.screenDimensions.height;
    return vector;
  }

  const hungerValue = label({
    text: "Hunger\n",
    initialValue: hawkHunger.get().toFixed(1),
    ...get2DPosition()
  });

  function setLabelTo ({ visible }) {
    if (visible) hungerValue.showLabel();
    else hungerValue.hideLabel();
  }

  let lastSimTime = 0;
  function update (elapsedTime, simulationTime) {
    count++;
    if (hawkHunger.get() >= maxHunger) {
      deathDelta += lastSimTime === 0 ? 0 : simulationTime - lastSimTime;
    } else if (isEating) {
      deathDelta = 0;
    }

    lastSimTime = simulationTime;
    const position = get2DPosition();
    hawkHunger.update(simulationTime, isEating);
    hungerValue.update(position.x, position.y, deathDelta.toFixed(1));

    if (hawkHunger.get() >= maxHunger * 0.75) {
      // Go get a rabbit
      checkForHare();
    } else if (hawkHunger.get() <= minHunger) {
      hawk.remove(hareMesh);
    }
    if (count % 30 === 0) {
      // The updates happen very often for small position changes
      // This made the hawk behave erratically.
      // The observers probably don't care if the hawk moves a small distance
      // May want to make this delta-position based.
      // for now just scale back the number of times the position is reported to the other animals.
      getHawkObserver().broadcast(hawk.position);
    }
  }
  TWEEN.update();

  function handleCollision (targets) {
    console.log(targets);
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].object.type === "Hare") {
        // added a hare when collision occur
        hawk.add(hareMesh);
        ate = true;
        isEating = true;
        SceneManager.removeObject(targets[i].object);
      }
    }
  }

  return {
    update,
    setLabelTo,
    model: hawk,
    created: new Date(),
    handleCollision
  };
}
export default Hawk;
