
import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import FindDistance from "../utils/Findistance";
const THREE = require("three");

export const NAME = "hare";
export const TYPE = "Hare";
let TWEEN = require("@tweenjs/tween.js");
function Hare (scene, hareCount) {
  //const size = 3;
  const color = "#db7093";
  let tween1 ={};
  let tween2 ={};
  let tween3 = {};
  let tween4 = {};
  let grassPositon = {};
  //let nearestGrassPositon = {};
  let distanceFromHawk = 0.00;
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
  //hareMesh = new THREE.Vector3(position.x,y,z);
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
  //var myName = "hare_" + hareCount;
  //console.log("subscribe to hawkObserver for " + myName);
  getHawkObserver().subscribe((position) => {

  });

  hareMesh.type = TYPE;

  function createTween() {

    tween1 = new TWEEN.Tween(hareMesh.position)
        .to({ x: hareMesh.position.x + 5, y: 10, z: hareMesh.position.z + 5 }, 10000);

    tween2 = new TWEEN.Tween(hareMesh.position)
        .to({ x: hareMesh.position.x + 10, y: 0, z: hareMesh.position.z + 15 }, 10000);

    tween3 = new TWEEN.Tween(hareMesh.position)
        .to({ x: hareMesh.position.x + 25, y: 10, z: hareMesh.position.z + 25 }, 10000)
        .start();
    tween4 = new TWEEN.Tween(hareMesh.position)
        .to({ x: hareMesh.position.x + 35, y: 0, z: hareMesh.position.z + 35 }, 10000);

  }


  function checkForHawks() {
    //console.log("Hare has found a hawk :  -->"  + getSceneManager().subjects[4].model.name);
    for (let i = 4; i < getSceneManager().subjects.length; i++){
      if (getSceneManager().subjects[i].model.name === "redtailHawk"){
      }
    }

    return distanceFromHawk;
  }
  function escapeFormHawk() {
   //TODO: chasing scene between hawks and hare
  }
  function nearestGrassPosition(grasses) {
 // console.log("I found grass objects " +grasses.children.length);
  let nearestPosition = 1000;
  let nearestPosition2 = 0.0;
  let position = 0;
    for(let i = 0 ; i < grasses.children.length; i++){
      nearestPosition2 = FindDistance(hareMesh, grasses.children[i]);
      if(nearestPosition2 < nearestPosition){
      nearestPosition = nearestPosition2;
      position = i;
      }
    }
   // console.log("Nearest Position : " + nearestPosition);
    return position;
  }
  //looking for closest grass potion
  function getGrassPosition() {
    let grassPosition = 0;
    for (let i = 0; i < getSceneManager().subjects.length; i++) {
      if(getSceneManager().subjects[i].model.type === "Grass"){
        grassPosition = nearestGrassPosition(getSceneManager().subjects[i].model);
            tween3 = new TWEEN.Tween(hareMesh.position).to(
                {
                  x: getSceneManager().subjects[i].model.children[grassPosition].position.x,
                  y: getSceneManager().subjects[i].model.children[grassPosition].position.y,
                  z: getSceneManager().subjects[i].model.children[grassPosition].position.z,
                },
                10000
            );
            tween2.chain(tween3);
            tween3.chain(tween1);
      }
    }
  }
  createTween();
  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween4);
  tween4.chain(tween1);

  function update ()
  {
    checkForHawks();
    getGrassPosition();
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
