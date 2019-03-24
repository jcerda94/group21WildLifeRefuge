import { getValue, random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { findRemoveIfNear } from "./GrassField";
import { hunger, label } from "../utils/behavior";
import { getHawks } from "./Hawk.js";
import { getTrees } from "./Tree.js";
import { get2DPosition } from "../utils/helpers";
import { getCapiInstance } from "../utils/CAPI/capi";
import FindDistance from "../utils/Findistance";

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

  const color = "#db7093";
  let tween1 = {};
  let tween2 = {};
  let tween3 = {};

  let distanceFromHawk = 0.0;
  // create a sphere
  var sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  var sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  var hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  hareMesh.name = "hare";

  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  const x = random(-widthBound, widthBound);
  const y = 2;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  hareMesh.position.set(position.x, position.y, position.z);
  hareMesh.castShadow = true;
  hareMesh.userData = {
    selectable: true,
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
    initialValue: hareHunger.get().toFixed(1),
    x: currentPosition.x,
    y: currentPosition.y
  });

  const shouldShowLabel = getCapiInstance().getValue({ key: "Hare.label" });
  if (shouldShowLabel) hareLabel.showLabel();


  getHawkObserver().subscribe(position => {
    // this gets sent for every hawk, so shouldn't have to use the list thing
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
  function createTween () {
    // console.log("hare in create tween");
    tween1 = new TWEEN.Tween(hareMesh.position).to(
      { x: hareMesh.position.x + 5, y: 10, z: hareMesh.position.z + 5 },
      15000
    );
    let random_X = randomX();
    let random_Z = randomZ();
    let a = new THREE.Vector3(hareMesh.position.x,hareMesh.position.y, hareMesh.position.z );
    let b = new THREE.Vector3(random_X, 0, random_Z);
    let d = a.distanceTo(b);
    tween2 = new TWEEN.Tween(hareMesh.position).to(
      { x: random_X, y: 0, z: random_Z},
      d/0.03
    );
     random_X = randomX();
     random_Z = randomZ();
     a = new THREE.Vector3(hareMesh.position.x,hareMesh.position.y, hareMesh.position.z );
     b = new THREE.Vector3(random_X, 0, random_Z);
     d = a.distanceTo(b);
    tween3 = new TWEEN.Tween(hareMesh.position)
      .to(
        { x: random_X, y: 0, z: random_Z},
        d/0.03
      )
      .start();
    tween1.chain(tween3);
    tween2.chain(tween1);
    tween3.chain(tween2);
  }
  // function for animals to call to detect the distance to the closest hawk
  var checkForHawks = function (hare, hawkPos, range) {
    var harePos = hare.position;
    var distance = getDistance(hare.position, hawkPos);
    if (distance < range) {
      // console.log("hare[" + getHareID(hare) + "] ------ hawk at new shortestDist: " + distance.toFixed());
      escapeFromHawk(hare);
    }
    // else console.log(" ------ hawk far away: " + distance.toFixed());
  };

  function closestDistanceFromHawk() {
    const hawks = SceneManager.getSceneObjectsOf({ types: ["Hawk"] });
    let nearestPosition = 900;
    if(hawks.length > 0){
      let nearestPosition2 = 0.0;
      for(let i = 0 ; i < hawks.length; i++){
        nearestPosition2 = FindDistance(hareMesh, hawks[i]);
        if(nearestPosition2 < nearestPosition){
          nearestPosition = nearestPosition2;
        }
      }
    }
    return nearestPosition;
  }

  function escapeFromHawk (hare) {
    var harePos = hare.position;
    // console.log("hare[" + getHareID(hare) + "] escapeFromHawk: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );

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
      // console.log("hare[" + getHareID(hare) + "] moveToPosition: ");
      moveToPosition(hare, tree.position);
    }
  }
  function hideFromHawk (hare) {
    var harePos = hare.position;
    // console.log("hare[" + getHareID(hare) + "] hideFromHawk: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );

    // find the closest hawk and stay hidden until they fly away
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
    // console.log("hare[" + getHareID(hare) + "]  closest hawk at: " + shortestDist.toFixed() + "   range: " + range);
    if (shortestDist > range) {
      // console.log("hare[" + getHareID(hare) + "] ------ All clear of hawks: " + shortestDist.toFixed());
      // console.log("hare[" + getHareID(hare) + "] return false ");
      return false;
    }
    return true;
  }
  function pause (hare) {
    // console.log("hare[" + getHareID(hare) + "]    paused ");
   // tween1.stop();
    //tween2.stop();
    tween3.stop();
  }

  function resume (hare) {
    // console.log("hare[" + getHareID(hare) + "]    resume ");
    tween3.start();
    //tween1.stop();
    //tween2.stop();

  }
  var treePos;
  var movingToTree = false;
  // var savedTween3;
  let isMoveToTree = false;
  function moveToPosition (hare, newPos) {

    const harePos = hare.position;
    const a = new THREE.Vector3( hareMesh.position.x, hareMesh.position.y, hareMesh.position.z );
    const b = new THREE.Vector3(newPos.x, newPos.y, newPos.z );
    const d = a.distanceTo( b );
    let adjustX = 10;
    const adjustZ = 10;
    if(hareMesh.position.x <newPos.x){
      adjustX =  -10;
    }
    if(hareMesh.position.z < newPos.z){
      adjustX =  -10;
    }
    treePos = newPos;
    movingToTree = true;
    // console.log("hare[" + getHareID(hare) + "]    set movingToTree ");
    // this doesn't work
    // savedTween3 = tween3; // seems to keep this target position
    if(tween3 != null){
      tween3.stop();
      //tween2.stop();
      //tween1.stop();
    }

    const moveToTree = new TWEEN.Tween(hareMesh.position).to(
      {
        x: newPos.x + adjustX,
        y: newPos.y,
        z: newPos.z  + adjustZ
      },

      d/0.03
    );
    if(!isMoveToTree){
      moveToTree.start();
      isMoveToTree = true;
    }
    //this get called when hare stop at a tree
    moveToTree.onComplete(function () {
      isMoveToTree = false;
      moveToTree.stop();
      console.log("have reach the tree");
      const distanceFromHawk = closestDistanceFromHawk();
      console.log("Closest distance " + distanceFromHawk);
      if(distanceFromHawk > dangerRange){
        tween3.start();
      }

    })

  }

  createTween();

  var waitForHawksToFlyAway = true;
  var eating_pace = 20;
  var eating_paceCntr = eating_pace;

  function update (elapsedTime, simulationTime) {
    // TODO: this should really be real-time-based, not loop based
    // TODO: it should also be part of a behavior model so these can be tuned the behavior models here
    // if(eating_paceCntr-- == 0)
    updateLabelPosition();
    hareHunger.update(simulationTime);
    {
      eating_paceCntr = eating_pace;
      var deltaDistance = 500;
      findRemoveIfNear(hareMesh.position, deltaDistance);
    }

    if (movingToTree) {
      var id = getHareID(hareMesh);
      var distance = getDistance(hareMesh.position, treePos).toFixed();

      // console.log("hare[" + id + "] to tree dist: " + distance);
      if (parseInt(distance) < 30) {
        // console.log("hare[" + id + "] paused: " );  // this is working, now wait until hawks fly away
        pause(hareMesh);
        waitForHawksToFlyAway = true;
        movingToTree = false;
        // console.log("hare[" + getHareID(hareMesh) + "]    clear movingToTree ");
      }
    }
    if (waitForHawksToFlyAway) {
      var ret = hideFromHawk(hareMesh);
      // console.log("hare[" + getHareID(hareMesh) + "]    hideFromHawk retuns: " + ret);
      if (!ret) {
        // console.log("hare[" + getHareID(hareMesh) + "]    done hiding");
        waitForHawksToFlyAway = false;
        // tween3 = savedTween3;
        resume(hareMesh);
      }
      // else console.log("hare[" + getHareID(hareMesh) + "]    continue hiding");
    }
    TWEEN.update();
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
