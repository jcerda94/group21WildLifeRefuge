import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";
import { getHawkObserver } from "./observer.js";
import {
  hunger,
  label,
  watchAnimal,
  gender,
  breed,
  pauseResume,
  fleeToPosition,
  moveToFood,
  death
} from "../utils/behavior";
import { get2DPosition, findClosestModel } from "../utils/helpers";
import { getCapiInstance } from "../utils/CAPI/capi";
import { createHareTweens } from "../utils/animations";
import { getEnvironmentManager } from "./EnvironmentManager";

const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

export const NAME = "hare";
export const TYPE = "Hare";

function Hare () {
  const CAPI = getCapiInstance();

  const maxHunger = 20;
  const minHunger = 1;
  const hareHunger = hunger({
    maxHunger,
    minHunger,
    type: TYPE
  });
  const genderBias = getCapiInstance().getValue({ key: "Hare.maleBias" }) || 50;
  const hareGender = gender({ bias: genderBias });
  const tweens = [];
  const color = hareGender === "female" ? "#db7093" : "#407093";

  const sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  const hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  hareMesh.name = "hare";

  const breedBehavior = breed({
    gender: hareGender,
    type: TYPE,
    id: hareMesh.uuid,
    breedingHandler
  });

  function breedingHandler () {
    if (hareGender === "female") {
      const babyHare = ModelFactory.makeSceneObject({
        type: "hare",
        config: {
          useCollision: true,
          collision: {
            targets: ["Grass"]
          }
        }
      });
      SceneManager.addObject(babyHare);
    }
  }

  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  for (let s_idx = 0; s_idx < SceneManager.scene.length; s_idx++) {
    for (let i = 0; i < SceneManager.scene[s_idx].children.length; i++) {
      console.log(
        "SceneManager.scene: " + SceneManager.scene[s_idx].children[i].name
      );
    }
  }

  const x = random(-widthBound, widthBound);
  const y = 2;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  hareMesh.position.set(position.x, position.y, position.z);
  hareMesh.castShadow = true;
  hareMesh.userData = {
    selectable: true,
    gender: hareGender,
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };

  const currentPosition = get2DPosition(hareMesh);
  const hareLabel = label({
    text: "Hunger\n",
    type: "Hare",
    initialValue: hareHunger.get().toFixed(1),
    x: currentPosition.x,
    y: currentPosition.y
  });

  const shouldShowLabel = CAPI.getValue({ key: "Hare.label" });
  if (shouldShowLabel) hareLabel.showLabel();

  const checkHawkDanger = hawkPosition => {
    const sightRange = CAPI.getValue({ key: "Hare.sightRange" });
    const harePos = hareMesh.position;
    const distance = harePos.distanceTo(hawkPosition);
    if (distance < sightRange) {
      const closest = findClosestModel("Tree", harePos);

      if (!closest.model || gettingFood) return;

      const moveTween = fleeToPosition(
        hareMesh,
        closest.model.position,
        tweens,
        createHareTweens
      );
      if (moveTween) tweens.push(moveTween);
    }
  };

  let gettingFood = false;
  let targettedFoodId = null;
  let eatingFood = false;

  const getFood = ({ type }) => {
    const closestFood = findClosestModel(type, hareMesh.position);

    if (!closestFood.model) {
      return null;
    }
    const foodLocation = closestFood.model.position;
    const foodID = closestFood.model.uuid;
    moveToFood(hareMesh, foodLocation, tweens, createHareTweens);
    return foodID;
  };

  const hawkObserver = watchAnimal(getHawkObserver(), checkHawkDanger);

  hareMesh.type = TYPE;

  tweens.push(...createHareTweens(hareMesh));

  let pausedTweens = [];
  const pause = () => {
    pausedTweens.length = 0;
    tweens.forEach((tween, i) => {
      if (tween.isPlaying()) {
        tween.stop();
        pausedTweens.push(i);
      }
    });
  };

  const resume = () => {
    pausedTweens.forEach(i => {
      if (tweens[i]) {
        tweens[i].start && tweens[i].start();
      }
    });
  };

  const checkIfDoneEating = currentHunger => {
    const wasEatingAndFoodIsGone =
      (gettingFood || eatingFood) &&
      targettedFoodId !== null &&
      !SceneManager.hasSceneObject({ id: targettedFoodId });
    const doneEating = currentHunger <= minHunger && eatingFood;

    if (wasEatingAndFoodIsGone || doneEating) {
      eatingFood = false;
      gettingFood = false;
      SceneManager.removeObjectByUUID(targettedFoodId);
      targettedFoodId = null;
      tweens.forEach(tween => {
        tween.stop && tween.stop();
        TWEEN.remove(tween);
      });
      tweens.length = 0;
      tweens.push(...createHareTweens(hareMesh));
    }
  };

  const hareDeathBehavior = death("Hare");

  function update (elapsedTime, simulationTime) {
    updateLabelPosition();
    const currentHunger = hareHunger.update(simulationTime, eatingFood);

    if (currentHunger > maxHunger * 0.75 && !gettingFood) {
      targettedFoodId = getFood({ type: "Grass" });
      gettingFood = true;
    }

    if (hareDeathBehavior.isDead(simulationTime, hareHunger, eatingFood)) {
      SceneManager.removeObject(hareMesh);
    }

    checkIfDoneEating(currentHunger);

    if (hareGender === "female") {
      breedBehavior.signal(simulationTime);
    }
  }

  function handleCollision (targets) {
    targets.forEach &&
      targets.forEach(target => {
        let parent = target.object.parent;
        while (parent) {
          if (parent.uuid === targettedFoodId) {
            eatingFood = true;
          }
          parent = parent.parent;
        }
      });
  }

  function setLabelTo ({ visible }) {
    if (visible) hareLabel.showLabel();
    else hareLabel.hideLabel();
  }

  const pauseResumeBehavior = pauseResume(pause, resume);

  function onDestroy () {
    tweens.forEach(tween => TWEEN.remove(tween));
    pauseResumeBehavior();
    hawkObserver();
    hareLabel.destroy();
    getEnvironmentManager().onDeath(hareMesh);
  }

  function updateLabelPosition () {
    const currentPosition = get2DPosition(hareMesh);
    hareLabel.update(
      currentPosition.x,
      currentPosition.y,
      hareHunger.get().toFixed(1)
    );
  }

  getEnvironmentManager().registerTrackedObject(hareMesh);

  return {
    update,
    model: hareMesh,
    setLabelTo,
    onDestroy,
    updateLabelPosition,
    created: new Date(),
    handleCollision
  };
}
export function getHareID (theHare) {
  return theHare.id;
}

export default Hare;
