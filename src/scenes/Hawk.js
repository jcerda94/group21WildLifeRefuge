/*


   Update: 2/23/2019 by: Thongphanh Duangboudda
   contents: add collision detection
   Reference URL: https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Collision-Detection.html
 */


import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getHawkObserver } from "./observer.js";
import ModelFactory from "./ModelFactory";
import AddModels from "./AddModels";
const THREE = require("three");

export const NAME = "redtailHawk";
export const TYPE = "Hawk";

var TWEEN = require("@tweenjs/tween.js");
let collidableMeshList = [];

function Hawk () {
  let collide = true;
  const size = 3;
  const color = "#db7093";

  const geometry = new THREE.CubeGeometry(size, size * 5, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
 // cube.position.y = 5;

  // create a sphere
  var sphereGeometry = new THREE.SphereGeometry(6, 30, 30);
  var sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  var hareMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
 // hareMesh.position.y = 0;

  hareMesh.name = "hare";

  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  const x = random(-widthBound, widthBound);
  const y = 100;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  let hawk = new THREE.Object3D();
  hawk.position.set(position.x, position.y, position.z);
  hareMesh.position.y = hawk.position.y - 4;
  cube.position.y = hawk.position.y;
  hawk.add(cube);
 // hawk.add(hareMesh);
  hawk.userData = {
    selectable: true,
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };

  hawk.name = NAME;
  hawk.type = TYPE;

  const tween1 = new TWEEN.Tween(hawk.position).to(
    { x: 500, y: 150, z: -100 },
    10000/3
  );

  const tween2 = new TWEEN.Tween(hawk.position)
    .to({ x: -500, y: 100, z: 100 }, 10000/3)
    .start();

  var tween3 = {};

  // hawk must track it's position and look for hares nearby as it flys
  getHawkObserver().subscribe(position => {
    // console.log("hawkObserver method called for Hawk: ");
    //checkForHare(position);
  });

  function checkForHare () {
    for (let i = 4; i < getSceneManager().subjects.length; i++) {
      // console.log("Hawk:checkForHare:  length : " + getSceneManager().subjects.length );
      if (getSceneManager().subjects.length > 4) {
        if (getSceneManager().subjects[i].model.name == "hare") {
          // console.log(" Found a hare: " + position.x + ":" + position.y + ":" + position.z);
          // JWC  tween3 = new TWEEN.Tween(cube.position)
          tween3 = new TWEEN.Tween(hawk.position).to(
            {
              x: getSceneManager().subjects[i].model.position.x,
              y: getSceneManager().subjects[i].model.position.y,
              z: getSceneManager().subjects[i].model.position.z
            },
            10000/4
          );
          tween2.chain(tween3);
          tween3.chain(tween1);
          console.log("Colliding " + hareMesh.position.y);
          hareMesh.position.y = hawk.position.y - 4;
          cube.position.y = hawk.position.y;
         // let aHare = SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hare" }));
            hawk.add(hareMesh);
          if(detectCollision()){
          hawk.add(hareMesh);
            //console.log("Colliding " + hawk.position.y);

            //collide = false;
          }

        }
      }
    }
  }
  tween1.chain(tween2);
  tween2.chain(tween1);

  //detect collision
    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //		intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    let originPoint = cube.position.clone();
  function detectCollision() {
      for (let vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
      {
          let localVertex = cube.geometry.vertices[vertexIndex].clone();
          let globalVertex = localVertex.applyMatrix4( cube.matrix );
          let directionVector = globalVertex.sub( cube.position );

          let ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
          let collisionResults = ray.intersectObjects( collidableMeshList );
          if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
              return true;
      }

      return false;
  }

  function update () {
    // console.log("hawk updated");
    // get the position and then it should call the observers
    checkForHare();
    getHawkObserver().broadcast(cube.position);
    TWEEN.update();
   // hareMesh.position.y = hawk.position.y - 4;

  }

  return {
    update,
    model: hawk,
    created: new Date()
  };
}

export default Hawk;
