
import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
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
    //console.log("hawkObserver method called for " + myName);
    //checkForHare(position);
  });

  //scene.add(hareMesh);
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

  }
  function nearestGrassPosition(grasses) {

    for(let i = 0 ; i < grasses.children.length; i++){

    }

  }
  //looking for closest grass potion
  function getGrassPosition() {
  //getSceneManager().getSceneObjectsOf ({hareMesh});
    const grassPosition ={};
    for (let i = 0; i < getSceneManager().subjects.length; i++) {
      if(getSceneManager().subjects[i].model.type === "Grass"){
        if (getSceneManager().subjects.length > 4) {
          if (getSceneManager().subjects[i].model.type === "Grass") {
            tween3 = new TWEEN.Tween(hareMesh.position).to(
                {
                  x: getSceneManager().subjects[i].model.position.x,
                  y: getSceneManager().subjects[i].model.position.y,
                  z: getSceneManager().subjects[i].model.position.z
                },
                10000
            );
            tween2.chain(tween3);
            tween3.chain(tween1);
          }
        }
        //const nearestGrassObject = nearestGrassPosition(getSceneManager().subjects[i].model);


      }
     // console.log("Hawk:checkForHare:  length : " + getSceneManager().subjects[4].model.type);


    }

    return grassPosition;

  }
  createTween();
  checkForHawks();
  //getGrassPosition();
  //console.log(" check for distance from a hawk");

  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween4);
  tween4.chain(tween1);

  function update ()
  {
    checkForHawks();
    getGrassPosition();
    //console.log("hare update");
    TWEEN.update();
  }
  function handleCollision (targets) {
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].object.type === "Hare") {
        SceneManager.removeObject(targets[i].object);
      }
    }
  }


  return {
    update,
    model: hareMesh,
    created: new Date()
  };
}

export default Hare;
