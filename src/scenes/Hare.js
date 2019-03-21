import { getValue, random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import { findRemoveIfNear } from "./GrassField";
import { pauseResume } from "../utils/behavior";
import FindDistance from "../utils/Findistance";

const THREE = require("three");

export const NAME = "hare";
export const TYPE = "Hare";
let TWEEN = require("@tweenjs/tween.js");
var numberOfHares = 0;

function Hare (scene, hareCount) {
  // const size = 3;
  const color = "#db7093";
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

  // console.log("SceneManager: " + JSON.stringify(SceneManager) );
  //console.log("=======================================================: ");
  for (let s_idx = 0; s_idx < SceneManager.scene.length; s_idx++) {
    // console.log("SceneManager.subjects[" + i + "]: " + SceneManager.subjects[i].model.name );
    for (let i = 0; i < SceneManager.scene[s_idx].children.length; i++) {
      console.log(
        "SceneManager.scene: " + SceneManager.scene[s_idx].children[i].name
      );
    }
  }
  // console.log("SceneManager[4]: " + JSON.stringify(SceneManager.subjects[4].model.metadata) );

 // console.log("=======================================================: ");

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

  // TODO: when hare finds hawk hide under a bush
  function checkForHawks () {
    const hawks = SceneManager.getSceneObjectsOf({ types: ["Hawk"] });
   // console.log("there are " + hawk.length);
    const nearestHawk = nearestHawkPosition(hawks);
    // console.log("Hare has found a hawk :  -->"  + getSceneManager().subjects[4].model.name);
    const distanceFromHawk = FindDistance(hareMesh, hawks[nearestHawk]);
      //console.log("Position form hawk + " + FindDistance(hareMesh, hawks[nearestHawk]));
      if(distanceFromHawk < 50){
        chaseScene();

      }



  }

  function nearestHawkPosition(hawks) {
    // console.log("I found grass objects " +grasses.children.length);
    let nearestPosition = 1000;
    let nearestPosition2 = 0.0;
    let position = 0;
    for(let i = 0 ; i < hawks.length; i++){
      nearestPosition2 = FindDistance(hareMesh, hawks[i]);
      if(nearestPosition2 < nearestPosition){
        nearestPosition = nearestPosition2;
        position = i;
      }
    }
    // console.log("Nearest Position : " + nearestPosition);
    return position;
  }
  function chaseScene() {
    tween1.stop();
    tween2.stop();
    const tween3 = new TWEEN.Tween(hareMesh.position)
        .to(
            { x: hareMesh.position.x + 50, y: 10, z: hareMesh.position.z + 25 },
            10000 / 10
        )
        .start();



  }
  function escapeFormHawk () {}
  // looking for closest grass potion
  // function getGrassPosition() {
  //  const grassPosition ={};
  //  return grassPosition;
  // }

  myHareID = numberOfHares++;

  //console.log("hare created: hare__" + myHareID);
  const tween1 = new TWEEN.Tween(hareMesh.position).to(
    { x: hareMesh.position.x + 5, y: 10, z: hareMesh.position.z + 5 },
    10000 / 10
  );

  const tween2 = new TWEEN.Tween(hareMesh.position).to(
    { x: hareMesh.position.x + 10, y: 0, z: hareMesh.position.z + 15 },
    10000 / 10
  );

  const tween3 = new TWEEN.Tween(hareMesh.position)
    .to(
      { x: hareMesh.position.x + 25, y: 10, z: hareMesh.position.z + 25 },
      10000 / 10
    )
    .start();
  //tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween1);
  // tween4.chain(tween1);

  var eating_pace = 20;
  var eating_paceCntr = eating_pace;

  const pauseResumeCleanup = pauseResume(pauseHare, resumeHare);

  function update () {
    checkForHawks();

    // TODO: this should really be real-time-based, not loop based
    // TODO: it should also be part of a behavior model so these can be tuned the behavior models here
    // if(eating_paceCntr-- == 0)
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

  function pauseHare () {
    tween3.stop();
  }

  function resumeHare () {
    tween3.start();
  }

  function onDestroy () {
    pauseResumeCleanup();
  }

  return {
    update,
    model: hareMesh,
    onDestroy,
    created: new Date(),
    handleCollision
  };
}

export default Hare;
