import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { getHareID } from "./Hare.js";
import { random, randomInt, findClosestModel } from "../utils/helpers";
import { createHawkTweens } from "../utils/animations";
import {
  hunger,
  gender,
  breed,
  label,
  pauseResume,
  death
} from "../utils/behavior";
import { getCapiInstance } from "../utils/CAPI/capi";
import ModelFactory from "./ModelFactory";
import {getEnvironmentManager} from "./EnvironmentManager";

const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var numberHawks = 0;
let TWEEN = require("@tweenjs/tween.js");

function Hawk (config) {
  let routineTweenStop = true;
  let hawkSpeed = 0.05;
  let isEating = false;
  let deathDelta = 0;
  const maxHunger = 10;
  const minHunger = 1;
  const size = 3;
  const tweens = [];

  const genderBias = getCapiInstance().getValue({ key: "Hawk.maleBias" }) || 50;
  const hawkGender = gender({ bias: genderBias });
  const color = hawkGender === "female" ? "#db7093" : "#407093";

  // create a sphere or a hare
  const sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color });
  const hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  hareMesh.name = "attachedHare";

  const geometry = new THREE.CubeGeometry(size, size * 5, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const hawk = new THREE.Mesh(geometry, material);

  const SceneManager = getSceneManager();

  hawk.userData = {
    selectable: true,
    gender: hawkGender,
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };
  hawk.name = NAME;
  hawk.type = TYPE;

  const breedBehavior = breed({
    gender: hawkGender,
    type: TYPE,
    id: hawk.uuid,
    breedingHandler
  });

  function breedingHandler () {
    if (hawkGender === "female") {
      const babyHawk = ModelFactory.makeSceneObject({ type: "hawk" });
      SceneManager.addObject(babyHawk);
    }
  }

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

  let chase = false;
  let newCycleChase = false;
  var myHawkID = numberHawks++;
  let selectedHareIndex = 0;
  let chaseSelectedHare = false;

  const hawkTweens = createHawkTweens(hawk);
  tweens.push(...hawkTweens);

  let targettedHareId = null;
  let isChasingHare = false;
  let tweenChase = new TWEEN.Tween(hawk.position);

  const endChase = () => {
    tweens.forEach(tween => {
      tween.stop && tween.stop();
      TWEEN.remove(tween);
    });
    tweens.length = 0;
    tweens.push(...createHawkTweens(hawk));
    isChasingHare = false;
  };

  const checkForHare = () => {
    let hareTarget = null;
    if (targettedHareId === null) {
      const closestHare = findClosestModel("Hare", hawk.position);
      if (!closestHare.model) {
        return;
      }
      hareTarget = closestHare.model;
      targettedHareId = hareTarget.uuid;
    }

    if (!hareTarget) {
      const hare = SceneManager.getSceneObjectByID({ id: targettedHareId });
      if (!hare) {
        targettedHareId = null;
        endChase();
        return;
      }
      hareTarget = hare.model;
    }

    // Apply chase speed only when not already chasing
    if (isChasingHare) {
      tweenChase.to(hareTarget.position);
    } else {
      const distance = hawk.position.distanceTo(hareTarget.position);
      const chaseSpeed = distance * random(10, 20);
      tweenChase.to(hareTarget.position, chaseSpeed);
    }

    if (isChasingHare) return;
    tweens.forEach(tween => {
      tween.stop && tween.stop();
      TWEEN.remove(tween);
    });
    tweens.length = 0;
    tweens.push(tweenChase);
    tweenChase.start();
    tweenChase.onComplete(endChase);
    isChasingHare = true;
  };

  const hawkHunger = hunger({
    maxHunger,
    minHunger,
    type: TYPE
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
    type: TYPE,
    ...get2DPosition()
  });
  const shouldShowLabel = getCapiInstance().getValue({ key: "Hawk.label" });
  if (shouldShowLabel) hungerLabel.showLabel();

  function setLabelTo ({ visible }) {
    if (visible) hungerLabel.showLabel();
    else hungerLabel.hideLabel();
  }

  function onDestroy () {
    tweens.forEach(tween => TWEEN.remove(tween));
    hungerLabel.destroy();
    pauseResumeCleanup();
    getEnvironmentManager().onDeath(hawk);
  }

  function updateLabelPosition () {
    const position = get2DPosition();
    hungerLabel.update(position.x, position.y, hawkHunger.get().toFixed(1));
  }

  let pausedTweens = [];
  const pauseHawk = () => {
    pausedTweens.length = 0;
    tweens.forEach((tween, i) => {
      if (tween.isPlaying()) {
        tween.stop();
        pausedTweens.push(i);
      }
    });
  };

  const resumeHawk = () => {
    pausedTweens.forEach(i => {
      if (tweens[i]) {
        tweens[i].start && tweens[i].start();
      }
    });
  };

  const pauseResumeCleanup = pauseResume(pauseHawk, resumeHawk);

  let lastPositionBroadcast = null;
  const hawkObserver = getHawkObserver();

  const hawkDeathBehavior = death("Hawk");

  function update (elapsedTime, simulationTime) {
    updateLabelPosition();

    if (hawkGender === "female") {
      breedBehavior.signal(simulationTime);
    }

    hawkHunger.update(simulationTime, isEating);
    const currentHugner = hawkHunger.get();

    if (hawkDeathBehavior.isDead(simulationTime, hawkHunger, isEating)) {
      SceneManager.removeObject(hawk);
    }

    if (currentHugner >= maxHunger * 0.75 && !isEating) {
      checkForHare();
    }
    if (currentHugner <= minHunger && isEating) {
      hawk.remove(hareMesh);
      chase = false;
      isEating = false;
    }

    if (lastPositionBroadcast === null) lastPositionBroadcast = elapsedTime;
    if (elapsedTime - lastPositionBroadcast > 1) {
      lastPositionBroadcast = elapsedTime;
      hawkObserver.broadcast(hawk.position);
    }
  }

  function handleCollision (targets) {
    if (targettedHareId === null) return;
    const hare = targets.find(target => target.object.uuid === targettedHareId);
    if (!hare) {
      // Didn't collide with target
      return;
    }
    hareMesh.material.color = hare.object.material.color;
    hawk.add(hareMesh);
    endChase();
    isEating = true;
    SceneManager.removeObject(hare.object);
  }

  getEnvironmentManager().registerTrackedObject(hawk);

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
export var getHawks = function () {
  return getSceneManager().getSceneObjectsOf({ types: ["Hawk"] });
};

export default Hawk;
