import { getValue, random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";
import { getHawkObserver } from "./observer.js";
import { findRemoveIfNear } from "./GrassField";
import { hunger, label, gender, breed, pauseResume } from "../utils/behavior";
import { getHawks } from "./Hawk.js";
import { getTrees } from "./Tree.js";
import { get2DPosition } from "../utils/helpers";
import { getCapiInstance } from "../utils/CAPI/capi";

import FindDistance from "../utils/Findistance";
import { animate } from "../utils/animations";

const THREE = require("three");

export const NAME = "hare";
export const TYPE = "Hare";
let TWEEN = require("@tweenjs/tween.js");

function Hare (config) {
  const dangerRange = 170;
  const maxHunger = 20;
  const minHunger = 1;
  const hungerTickRate = 0.0001;
  const hareHunger = hunger({
    maxHunger,
    minHunger,
    hungerTickRate
  });
  const genderBias = getCapiInstance().getValue({ key: "Hare.maleBias" }) || 50;
  const hareGender = gender({ bias: genderBias });
  const tweens = [];
  const color = hareGender === "female" ? "#db7093" : "#407093";

  let distanceFromHawk = 0.0;

  var sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  var sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  var hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  hareMesh.name = "hare";

  const breedBehavior = breed({
    gender: hareGender,
    type: TYPE,
    id: hareMesh.uuid,
    breedingHandler
  });

  function breedingHandler () {
    if (hareGender === "female") {
      const babyHare = ModelFactory.makeSceneObject({ type: "hare" });
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

  const shouldShowLabel = getCapiInstance().getValue({ key: "Hare.label" });
  if (shouldShowLabel) hareLabel.showLabel();

  getHawkObserver().subscribe(position => {
    checkForHawks(hareMesh, position, dangerRange);
  });

  hareMesh.type = TYPE;

  const randomX = () => {
    const groundX = SceneManager.groundSize.x / 2;
    return random(-groundX, groundX);
  };

  const randomZ = () => {
    const groundZ = SceneManager.groundSize.y / 2;
    return random(-groundZ, groundZ);
  };

  var checkForHawks = function (hare, hawkPos, range) {
    var harePos = hare.position;
    var distance = getDistance(hare.position, hawkPos);
    if (distance < range) {
      escapeFromHawk(hare);
    }
  };

  function closestDistanceFromHawk () {
    const hawks = SceneManager.getSceneObjectsOf({ types: ["Hawk"] });
    let nearestPosition = 900;
    if (hawks.length > 0) {
      let nearestPosition2 = 0.0;
      for (let i = 0; i < hawks.length; i++) {
        nearestPosition2 = FindDistance(hareMesh, hawks[i]);
        if (nearestPosition2 < nearestPosition) {
          nearestPosition = nearestPosition2;
        }
      }
    }
    return nearestPosition;
  }

  function escapeFromHawk (hare) {
    var harePos = hare.position;

    const trees = SceneManager.getSceneObjectsOf({ types: ["Tree"] });

    var shortestDist = 1000000.1;
    var tree;
    for (var idx = 0; idx < trees.length; idx++) {
      var x = trees[idx];
      var distance = getDistance(hare.position, x.position);
      if (shortestDist > distance) {
        shortestDist = distance;
        tree = trees[idx];
      }
    }

    const numberOfTrees = SceneManager.getSceneObjectsOf({ types: ["Tree"] });
    if (numberOfTrees.length > 0) {
    }
  }
  function hideFromHawk (hare) {
    var harePos = hare.position;

    const hawks = SceneManager.getSceneObjectsOf({ types: ["Hawk"] });
    var shortestDist = 1000000.1;
    for (var idx = 0; idx < hawks.length; idx++) {
      var x = hawks[idx];
      var distance = getDistance(hare.position, x.position);
      if (shortestDist > distance) {
        shortestDist = distance;
      }
    }
    var range = dangerRange;
    if (shortestDist > range) {
      return false;
    }
    return true;
  }

  function pause (hare) {}

  function resume (hare) {}

  pauseResume(pause, resume);

  var treePos;
  var movingToTree = false;
  let isMoveToTree = false;

  var waitForHawksToFlyAway = true;
  var eating_pace = 20;
  var eating_paceCntr = eating_pace;

  let animating = false;
  function update (elapsedTime, simulationTime) {
    updateLabelPosition();
    if (!animating) {
      const { x, y, z } = hareMesh.position;
      animating = true;
      tweens.push(
        animate({
          model: hareMesh,
          to: { dx: 100, dy: 25, dz: 100 },
          options: {
            duration: 2000,
            update: d => console.log("updating: ", d),
            callback: () => {
              console.log("done");
            }
          }
        })
      );
    }

    TWEEN.update();

    hareHunger.update(simulationTime);
    if (hareGender === "female") {
      breedBehavior.signal(simulationTime);
    }
    eating_paceCntr = eating_pace;
    var deltaDistance = 500;
    findRemoveIfNear(hareMesh.position, deltaDistance);

    if (movingToTree) {
      var id = getHareID(hareMesh);
      var distance = getDistance(hareMesh.position, treePos).toFixed();

      if (parseInt(distance) < 30) {
        pause(hareMesh);
        waitForHawksToFlyAway = true;
        movingToTree = false;
      }
    }
    if (waitForHawksToFlyAway) {
      var ret = hideFromHawk(hareMesh);
      if (!ret) {
        waitForHawksToFlyAway = false;
        resume(hareMesh);
      }
    }
  }
  function handleCollision (targets) {
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].object.type === "Grass") {
        console.log("Collision occur between grass and hare");
        SceneManager.removeObject(targets[i].object);
      }
    }
  }

  function setLabelTo ({ visible }) {
    if (visible) hareLabel.showLabel();
    else hareLabel.hideLabel();
  }

  function onDestroy () {
    hareLabel.destroy();
  }

  function updateLabelPosition () {
    const currentPosition = get2DPosition(hareMesh);
    hareLabel.update(
      currentPosition.x,
      currentPosition.y,
      hareHunger.get().toFixed(1)
    );
  }

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
function getDistance (pos1, pos2) {
  return pos1.distanceTo(pos2);
}
export function getHareID (theHare) {
  return theHare.id;
}

export default Hare;
