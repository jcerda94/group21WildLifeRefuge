/*
  
  Reference:
  1. For create tree: 
  URL: https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157

 */

import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
const THREE = require("three");

export const NAME = "grass";
export const TYPE = "Grass";

async function Grass () {
  var sides = 8;
  var tiers = 6;

  console.log("Grass   0");
  const loadingManager = new THREE.LoadingManager();
  //loadingManager.onLoad = config.onLoad || (() => null);

  const loader = new THREE.GLTFLoader(loadingManager);
  console.log("Grass   1");

  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      "models/grass.gltf",
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });
  console.log("Grass   2");

  const bounds = getSceneManager().groundSize;
  bounds.x *= 0.95;
  bounds.y *= 0.95;
  const grass = originalGrass.clone();
  grass.children[0].children[0].userData = {
    selectable: true,
    color: {
      highlight: "#FFF",
      original: "#3baa5d",
      selected: "#FF00FF"
    }
  };
  console.log("Grass   3");

  const size = random(1, 2);

  const x = random(-bounds.x / 2, bounds.x / 2);
  const z = random(-bounds.y / 2, bounds.y / 2);

  const rotation = random(-Math.PI / 2, Math.PI / 2);

  grass.scale.set(size, size, size);
  grass.position.set(x, 0, z);
  grass.rotation.y = rotation;
  const grassMesh = grass.children[0].children[0].material;
  grassMesh.color.set(grass.children[0].children[0].userData.color.original);
  grass.children[0].children[0].material = grassMesh.clone();
  //grasses.add(grass);
  //console.log("grasses.length: " + grasses.length);

  var grassGeometry = new THREE.ConeGeometry(10, 10, sides, tiers);
  var grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x33ff33,
    flatShading: true
  });

  /*
  var grassTop1 = new THREE.Mesh(grassGeometry, grassMaterial);
  grassTop1.castShadow = false;
  grassTop1.receiveShadow = false;
  grassTop1.position.y = 50;
  grassTop1.rotation.y = Math.random() * Math.PI;

  var grassTop = new THREE.Mesh(grassGeometry, grassMaterial);
  grassTop.castShadow = false;
  grassTop.receiveShadow = false;
  grassTop.position.y = 45;
  grassTop.rotation.y = Math.random() * Math.PI;
  var grassTrunkGeometry = new THREE.CylinderGeometry(0.1, 2, 100);
  var trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x886633,
    flatShading: true
  });
  var grassTrunk = new THREE.Mesh(grassTrunkGeometry, trunkMaterial);

  grassTrunk.position.y = 0.25;
  var grass = new THREE.Object3D();
  grass.castShadow = true;

  grass.add(grassTrunk);
  grass.add(grassTop1);
  grass.add(grassTop);
  */
  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  //const x = random(-widthBound, widthBound);
  //const y = 1.5;
  //const z = random(-heightBound, heightBound);
  //const position = { x, y, z };

  //grass.position.set(position.x, position.y, position.z);
  grass.userData = {
    selectable: true,
    color: {
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };
  grass.name = NAME;

  grass.type = "grass";

  return {
    model: grass,
    created: new Date()
  };
}

export default Grass;
