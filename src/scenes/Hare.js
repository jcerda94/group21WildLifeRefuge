import { getValue, random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { findRemoveIfNear } from "./GrassField";
const THREE = require("three");

export const NAME = "hare";
export const TYPE = "Hare";
let TWEEN = require("@tweenjs/tween.js");
var numberOfHares = 0;

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

  //console.log("SceneManager: " + JSON.stringify(SceneManager) );
  console.log("=======================================================: ");
  for (let s_idx = 0; s_idx < SceneManager.scene.length; s_idx++) {
    //console.log("SceneManager.subjects[" + i + "]: " + SceneManager.subjects[i].model.name );
    for (let i = 0; i < SceneManager.scene[s_idx].children.length; i++) {
        console.log("SceneManager.scene: " + SceneManager.scene[s_idx].children[i].name );
    }
  }
  //console.log("SceneManager[4]: " + JSON.stringify(SceneManager.subjects[4].model.metadata) );

  console.log("=======================================================: ");

  const x = random(-widthBound, widthBound);
  const y = 2;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  hareMesh.position.set(position.x, position.y, position.z);
  // hareMesh = new THREE.Vector3(position.x,y,z);
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
  // var myName = "hare_" + hareCount;
  // console.log("subscribe to hawkObserver for " + myName);
  getHawkObserver().subscribe(position => {
    // console.log("hawkObserver method called for " + myName);
    // checkForHare(position);
  });

  // scene.add(hareMesh);
  hareMesh.type = TYPE;

  var myHareID;

  function createTween () {
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
  //TODO: when hare finds hawk hide under a bush
  function checkForHawks () {
    // console.log("Hare has found a hawk :  -->"  + getSceneManager().subjects[4].model.name);
    for (let i = 4; i < getSceneManager().subjects.length; i++) {
      if (getSceneManager().subjects[i].model.name === "redtailHawk") {
        // console.log("Hare has found a hawk :  -->"  + getSceneManager().subjects[i].model.name);
        // console.log("Hare has found a hawk");
      }
    }

    return distanceFromHawk;
  }
  function escapeFormHawk () {}
  // looking for closest grass potion
  // function getGrassPosition() {
  //  const grassPosition ={};
  //  return grassPosition;
  // }
  createTween();
  checkForHawks();

  myHareID = numberOfHares++;

  console.log("hare created: hare__" + myHareID);

  createTween();
  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween1);
  // tween4.chain(tween1);

  var eating_pace = 20;
  var eating_paceCntr = eating_pace;

  function update () {

    checkForHawks();

    //TODO: this should really be real-time-based, not loop based
    //TODO: it should also be part of a behavior model so these can be tuned the behavior models here
    if(eating_paceCntr-- == 0)
    {
      eating_paceCntr = eating_pace; 
      var deltaDistance = 500;
      findRemoveIfNear(hareMesh.position, deltaDistance);
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

export default Hare;
