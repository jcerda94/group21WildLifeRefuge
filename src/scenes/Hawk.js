import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { random, randomInt } from "../utils/helpers";
import { hunger, label, pauseResume } from "../utils/behavior";
import { getCapiInstance } from "../utils/CAPI/capi";
import FindDistance from "../utils/Findistance";

const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var numberHawks = 0;
let TWEEN = require("@tweenjs/tween.js");

function Hawk (config) {
  let sameTween = true;
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
  const distance = 1000;
  const tween1 = new TWEEN.Tween(hawk.position).to(
    { x: randomX(), y: 100, z: randomZ() },
    distance/0.05
  );

  const tween2 = new TWEEN.Tween(hawk.position).to(
    { x: randomX(), y: 100, z: randomZ() },
      distance/0.05
  );

  var tween3 = new TWEEN.Tween(hawk.position)
    .to({ x: randomX(), y: 50, z: randomZ() }, distance/0.05);
    tween3.start();

  // hawk must track it's position and look for hares nearby as it flys
  getHawkObserver().subscribe(position => {
    // console.log("hawkObserver method called for Hawk: ");
  });
  let tweenChase = null;
  let chase = false;
  let newCycleChase = false;
  var myHawkID = numberHawks++;

  function checkForHare () {

    if(isEating){
     console.log(" hawk has been eating");
    }
    if (!isEating) {
      console.log(" hawk has NOT been eating");

      tween3.stop();
      const hares = SceneManager.getSceneObjectsOf({ types: ["Hare"] });
      const hareIndex = randomInt(0, hares.length - 1);
      const randomHare = hares[hareIndex];
      if (!randomHare) {
        console.log("No target");
        routineFlying();
        return;
      }
      //console.log("target is acquired");

      if(tweenChase != null){

      }
      tween3.stop();
      tween2.stop();
      tween1.stop();
      const a = new THREE.Vector3( hawk.position.x, hawk.position.y, hawk.position.z );
      const b = new THREE.Vector3(randomHare.position.x, randomHare.position.y, randomHare.position.z );
      const d = a.distanceTo( b );

       tweenChase = new TWEEN.Tween(hawk.position).to(
        {
          x: randomHare.position.x,
          y: randomHare.position.y,
          z: randomHare.position.z
        },
        d/0.05
      );

      if(!chase){
        //console.log("target is acquired");
        tweenChase.start();
       chase = true;
      }
      tweenChase.onComplete(function() {
        console.log("got hare");
        if(isEating){
          routineFlying();
        }
        if(!isEating){
          //chase = false;
          console.log("did not get a hare");
          tweenChase = new TWEEN.Tween(hawk.position).to(
              {
                x: randomHare.position.x,
                y: randomHare.position.y,
                z: randomHare.position.z
              },
              10000/10
          );
          chase = false;
        }

      });

    }

  }


  function routineFlying(){

    tween3 = new TWEEN.Tween(hawk.position)
        .to({ x: randomX(), y: 50, z: randomZ() }, 10000);
    tween3.start();
    tween3.chain(tween2);
    tween2.chain(tween1);
    tween1.chain(tween2);
    console.log("start new routine");
  }
  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween2);
  var count = 1;

  const hawkHunger = hunger({
    maxHunger,
    minHunger,
    hungerTickRate: random(0.00001, 0.00005)
  });

  function get2DPosition () {
    SceneManager.camera.updateProjectionMatrix();
    const vector = hawk.position.clone().project(SceneManager.camera);
    vector.x = ((vector.x + 1) / 2) * SceneManager.screenDimensions.width - 14;
    vector.y = (-(vector.y - 1) / 2) * SceneManager.screenDimensions.height;
    return vector;
  }

  const hungerLabel = label({
    text: "Hunger\n",
    initialValue: hawkHunger.get().toFixed(1),
    ...get2DPosition()
  });
  const shouldShowLabel = getCapiInstance().getValue({ key: "hawkLabel" });
  if (shouldShowLabel) hungerLabel.showLabel();

  const pauseResumeCleanup = pauseResume(pauseHawk, resumeHawk);

  function setLabelTo ({ visible }) {
    if (visible) hungerLabel.showLabel();
    else hungerLabel.hideLabel();
  }

  function onDestroy () {
    hungerLabel.destroy();
    pauseResumeCleanup();
  }

  function updateLabelPosition () {
    const position = get2DPosition();
    hungerLabel.update(position.x, position.y, hawkHunger.get().toFixed(1));
  }

  function pauseHawk () {
    tween3.stop();
  }

  function resumeHawk () {
    tween3.start();
  }

  let lastSimTime = 0;

  function update (elapsedTime, simulationTime) {
    // console.log("call hawk");
    count++;
    // const position = get2DPosition();
    // hawkHunger.update(simulationTime);
    // hungerValue.update(position.x, position.y, hawkHunger.get().toFixed(1));

    if (deathDelta > deathTimer) {
      SceneManager.removeObject(hawk);
      hungerLabel.destroy();
    }
    if (hawkHunger.get() >= maxHunger) {
      deathDelta += lastSimTime === 0 ? 0 : simulationTime - lastSimTime;
    } else if (isEating) {
      deathDelta = 0;
    }

    lastSimTime = simulationTime;
    hawkHunger.update(simulationTime, isEating);
    updateLabelPosition();
    // hungerLabel.update(position.x, position.y, hawkHunger.get().toFixed(1));

    if (hawkHunger.get() >= maxHunger * 0.75) {
      // Go get a rabbit
      //checkForHare();
    } else if (hawkHunger.get() <= minHunger) {
      hawk.remove(hareMesh);
      chase = false;
      isEating = false;
    }
    if (count % 30 === 0) {
      // The updates happen very often for small position changes
      // This made the hawk behave erratically.
      // The observers probably don't care if the hawk moves a small distance
      // May want to make this delta-position based.
      // for now just scale back the number of times the position is reported to the other animals.
      getHawkObserver().broadcast(hawk.position);
    }
    checkForHare();
    TWEEN.update();
  }

  function handleCollision (targets) {
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].object.type === "Hare") {
        // added a hare when collision occur
        hawk.add(hareMesh);
        isEating = true;
        SceneManager.removeObject(targets[i].object);
      }
    }
  }

  return {
    update,
    setLabelTo,
    onDestroy,
    updateLabelPosition,
    model: hawk,
    created: new Date(),
    handleCollision
  };
}
export default Hawk;
