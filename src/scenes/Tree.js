import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
const THREE = require("three");

export const NAME = "tree";
export const TYPE = "Tree";

function Tree () {
  var sides = 8;
  var tiers = 6;
  var treeGeometry = new THREE.ConeGeometry(10, 10, sides, tiers);
  var treeMaterial = new THREE.MeshStandardMaterial({
    color: 0x33ff33,
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
  var treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 2, 100);
  var trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x886633,
    flatShading: true
  });
  var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);

  treeTrunk.position.y = 0.25;
  var tree = new THREE.Object3D();
  tree.castShadow = true;

  tree.add(treeTrunk);
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
      highlight: "#f7ff6d",
      selected: "#808080"
    },
    name: NAME
  };
  tree.name = NAME;

  tree.type = "Tree";

  return {
    model: tree,
    created: new Date()
  };
}

export default Tree;
