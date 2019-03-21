import { getValue, random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { findRemoveIfNear } from "./GrassField";
import { getTrees } from "./Tree.js";
const THREE = require("three");

export const NAME = "hare";
export const TYPE = "Hare";
let TWEEN = require("@tweenjs/tween.js");

function Hare (scene, hareCount) {
    // const size = 3;
    const color = "#db7093";
    let tween1 = {};
    let tween2 = {};
    let tween3 = {};
    // let tween4 = {};
    // let grassPositon = {};
    // let nearestGrassPositon = {};
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
    getHawkObserver().subscribe(position => {
    var deltaDistance = 500;
    // this gets sent for every hawk, so shouldn't have to use the list thing
    checkForHawks(hareMesh.position, position, deltaDistance);
  });

  hareMesh.type = TYPE;

  function createTween () {
    console.log("in create tween");
    tween1 = new TWEEN.Tween(hareMesh.position).to(
      { x: hareMesh.position.x + 5, y: 10, z: hareMesh.position.z + 5 },
      10000 / 10
    );

    tween2 = new TWEEN.Tween(hareMesh.position).to(
      { x: hareMesh.position.x + 10, y: 0, z: hareMesh.position.z + 15 },
      10000 / 10
    );

    tween3 = new TWEEN.Tween(hareMesh.position)
      .to(
        { x: hareMesh.position.x + 25, y: 10, z: hareMesh.position.z + 25 },
        10000 / 10
      )
      .start();
  }
  // function for animals to call to detect the distance to the closest hawk
  var checkForHawks = function (harePos, hawkPos, range) {
    var distance = getDistance(harePos, hawkPos);
    if (distance < range) {
      //console.log(" ------ hawk at new shortestDist: " + distance.toFixed());
      escapeFromHawk(harePos);
    }
    //else console.log(" ------ hawk far away: " + distance.toFixed());
    };

    //return distanceFromHawk;
  function escapeFromHawk (harePos) {
    //console.log(" escapeFromHawk: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );

    const trees = getTrees(); 
    //console.log(" trees length: " + trees.length); // <<< defined

    var shortestDist = 1000000.1;
    var tree; 
    for (var idx = 0; idx < trees.length; idx++) {
      var x = trees[idx];
      var distance = getDistance(harePos, x.position);
      if (shortestDist > distance) {
        shortestDist = distance;
        tree = trees[idx];
      }
    }
    
    //console.log(" ------ run to tree at : " + shortestDist.toFixed());
    const numberOfTress = SceneManager.getSceneObjectsOf({ types: ["Tree"] });
    if(numberOfTress.length > 0){
      moveToPosition(harePos, tree.position);
    }
  }
  function pause() {
    tween1.stop();
    tween2.stop();
    tween3.stop();
  }

  function resume() {
    tween3.start();
  }
  var treePos;
  var movingToTree = false;
  function moveToPosition(harePos, newPos){
    // I'm guessing that this works like this
    treePos = newPos;
    movingToTree = true;
    tween3 = new TWEEN.Tween(harePos).to(
      {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z
      },
      //1000 // speed?
      500
    );
    tween2.chain(tween3);
    tween3.chain(tween1);
  }

  createTween();
  
  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween1);
  // tween4.chain(tween1);

  var eating_pace = 20;
  var eating_paceCntr = eating_pace;

  function update () {

    //TODO: this should really be real-time-based, not loop based
    //TODO: it should also be part of a behavior model so these can be tuned the behavior models here
    //if(eating_paceCntr-- == 0)
    {
      eating_paceCntr = eating_pace; 
      var deltaDistance = 500;
       findRemoveIfNear(hareMesh.position, deltaDistance);
    }
    if(movingToTree)
    {
      var h_x = parseInt(hareMesh.position.x.toFixed());
      var t_x = parseInt(treePos.x.toFixed());
      console.log("hare x: tree x " + h_x + ":"+ t_x);
      if(h_x == t_x)
       //&&(hareMesh.position.y == treePos.y))
        pause();
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

  return {
    update,
    model: hareMesh,
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