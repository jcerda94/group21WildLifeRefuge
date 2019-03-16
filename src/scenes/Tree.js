/*
  
  Reference:
  1. For create tree: 
  URL: https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157

 */

import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";

import {getHawkObserver} from "./observer";

import {getEnvironmentManager} from "./EnvironmentManager";

const THREE = require("three");

export const NAME = "tree";
export const TYPE = "Tree";
let color = 0x33ff33;
function Tree (config) {
  var sides = 8;
  var tiers = 6;
  var treeGeometry = new THREE.ConeGeometry(10, 10, sides, tiers);
  let treeMaterial = new THREE.MeshStandardMaterial({
    color: color,
    flatShading: true
  });

  var treeTop1 = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop1.castShadow = true;
  treeTop1.receiveShadow = false;
  treeTop1.position.y = 50;
  treeTop1.rotation.y = Math.random() * Math.PI;

  var treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
  treeTop.castShadow = true;
  treeTop.receiveShadow = false;
  treeTop.position.y = 45;
  treeTop.rotation.y = Math.random() * Math.PI;
  let treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 2, 100);
  let trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x886633,
    flatShading: true
  });
  let treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  let treeTrunk2 = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
  treeTrunk2.position.y = 10;
  treeTrunk.position.y = 0.25;
  let tree = new THREE.Group();

  tree.castShadow = true;

  tree.add(treeTrunk);
  //tree.add(treeTrunk2);

  tree.add(treeTop1);
  tree.add(treeTop);


  const SceneManager = getSceneManager();
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  const x = random(-widthBound, widthBound);
  const y = 1.5;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  tree.position.set(position.x, position.y, position.z);
  tree.userData = {
    selectable: true,
    color: {
      highlight: "#ff6039",
      selected: "#808080"
    },
    name: NAME
  };
  tree.name = NAME;
  tree.type = TYPE;
  function setTreeLayFlat() {
    //tree fall flat on the ground
    tree.rotation.x = 90*Math.PI/180;

  }
  function setTreeto45Degree() {
    //tree fall flat on the ground
    tree.rotation.x = 90*Math.PI/290;

  }
  function setTreeToBronwnColor() {
   // treeMaterial.color= 0xFF7127; color: 0xFF7127
    tree.children[1].material.color.set( 0xff6039 );
    //tree.children[ 1 ].material.color.set( 0x00ff00 );
    //tree.treeMaterial.color.set( 0x00ff00 );
    /*
    color = 0xFF7127;
    treeMaterial = new THREE.MeshStandardMaterial({
      color:  0xFF6039,
      flatShading: true
    });
    tree.add(treeTop1);
    tree.add(treeTop);
    */
  }
 function update() {
   //setTreeLayFlat();
   setTreeto45Degree()
   setTreeToBronwnColor()
 }

  let env = getEnvironmentManager();
  env.registerTrackedObject(tree);

  return {
    update,
    model: tree,
    created: new Date()
  };


}

export default Tree;
