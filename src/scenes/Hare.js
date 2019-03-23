import { getValue, random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { findRemoveIfNear } from "./GrassField";
import { getHawks } from "./Hawk.js";
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
    const dangerRange = 300;
    getHawkObserver().subscribe(position => {
    // this gets sent for every hawk, so shouldn't have to use the list thing
    checkForHawks(hareMesh, position, dangerRange);
  });

  hareMesh.type = TYPE;

  function createTween () {
    //console.log("hare in create tween");
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
  var checkForHawks = function (hare, hawkPos, range) {
    var harePos = hare.position;
    var distance = getDistance(hare.position, hawkPos);
    if (distance < range) {
      //console.log("hare[" + getHareID(hare) + "] ------ hawk at new shortestDist: " + distance.toFixed());
      escapeFromHawk(hare);
    }
    //else console.log(" ------ hawk far away: " + distance.toFixed());
    };

    //return distanceFromHawk;
    function escapeFromHawk (hare) {
      var harePos = hare.position;
      //console.log("hare[" + getHareID(hare) + "] escapeFromHawk: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
  
      const trees = getTrees(); 
  
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
      
      const numberOfTress = SceneManager.getSceneObjectsOf({ types: ["Tree"] });
      if(numberOfTress.length > 0){
        //console.log("hare[" + getHareID(hare) + "] moveToPosition: ");
        moveToPosition(hare, tree.position);
      }
    }
    function hideFromHawk (hare) {
      var harePos = hare.position;
      //console.log("hare[" + getHareID(hare) + "] hideFromHawk: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
  
      // find the closest hawk and stay hidden until they fly away
      const hawks = getHawks(); 
      var shortestDist = 1000000.1;
      for (var idx = 0; idx < hawks.length; idx++) {
        var x = hawks[idx];
        var distance = getDistance(hare.position, x.position);
        if (shortestDist > distance) {
          shortestDist = distance;
        }
      }
      var range = dangerRange;
      //console.log("hare[" + getHareID(hare) + "]  closest hawk at: " + shortestDist.toFixed() + "   range: " + range);
      if(shortestDist > range) {
        //console.log("hare[" + getHareID(hare) + "] ------ All clear of hawks: " + shortestDist.toFixed());
        //console.log("hare[" + getHareID(hare) + "] return false ");
        return false;
      }
      return true; 
    }
  function pause(hare) {
    //console.log("hare[" + getHareID(hare) + "]    paused ");
    tween1.stop();
    tween2.stop();
    tween3.stop();
  }

  function resume(hare) {
    //console.log("hare[" + getHareID(hare) + "]    resume ");
    tween3.start();
    tween2.start();
    tween1.start();
  }
  var treePos;
  var movingToTree = false;
  //var savedTween3;
  function moveToPosition(hare, newPos){
    var harePos = hare.position;
    // I'm guessing that this works like this
    treePos = newPos;
    movingToTree = true;
    //console.log("hare[" + getHareID(hare) + "]    set movingToTree ");
    
    // this doesn't work
    //savedTween3 = tween3; // seems to keep this target position

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

  var waitForHawksToFlyAway = true;
  var eating_pace = 20;
  var eating_paceCntr = eating_pace;

  function update () {

    {
      eating_paceCntr = eating_pace; 
      var deltaDistance = 500;
      findRemoveIfNear(hareMesh.position, deltaDistance);
    }

    if(movingToTree) {
      var id = getHareID(hareMesh);
      var distance = getDistance(hareMesh.position, treePos).toFixed();

      //console.log("hare[" + id + "] to tree dist: " + distance);
      if(parseInt(distance) < 30){
        //console.log("hare[" + id + "] paused: " );  // this is working, now wait until hawks fly away
        pause(hareMesh); 
        waitForHawksToFlyAway = true;
        movingToTree = false;
        //console.log("hare[" + getHareID(hareMesh) + "]    clear movingToTree ");
      }
    }
    if(waitForHawksToFlyAway) {
      var ret = hideFromHawk(hareMesh);
      //console.log("hare[" + getHareID(hareMesh) + "]    hideFromHawk retuns: " + ret);
      if(!ret) {
        //console.log("hare[" + getHareID(hareMesh) + "]    done hiding");
        waitForHawksToFlyAway = false;
        //tween3 = savedTween3;
        resume(hareMesh);
      }
      //else console.log("hare[" + getHareID(hareMesh) + "]    continue hiding");
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