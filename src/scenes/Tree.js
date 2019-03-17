/*
  
  Reference:
  1. For create tree: 
  URL: https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157
  Update: March 16, 2019
  By: Thongphanh Duangboudda
  Created Andrew for thirsty label and logic codes.
 */

import { getSceneManager } from "./SceneManager";
import { random, randomInt } from "../utils/helpers";
import {label, waterLevel} from "../utils/treeBehavior";
import {getEnvironmentManager} from "./EnvironmentManager";
import {getCapiInstance} from "../utils/CAPI/capi";

const THREE = require("three");

export const NAME = "tree";
export const TYPE = "Tree";
let color = 0x33ff33;

function Tree (config) {
  let removeLabel = false;
  let treeDeath = false;
  let isConsuming = false;
  let deathDelta = 0;
  const deathTimer = 60 * 60 * 24; // Eat within a day at max hunger or die
  const maxThirsty = 10;
  const minThirsty = 1;
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
    tree.rotation.x = 90*Math.PI/180;
  }
  function setTreeTo45Degree() {
    tree.rotation.x = 90*Math.PI/290;
  }
  function setTreeToBrownColor() {
    tree.children[1].material.color.set( 0xff6039 );
  }
  function setTreeToGreen(){
    tree.children[1].material.color.set( 0x33ff33 );
  }

  let env = getEnvironmentManager();
  //env.toggleEnvironmentViewOnCanvas();
  env.registerTrackedObject(tree);

  const treeThirsty = waterLevel({
    maxThirsty,
    minThirsty,
    hungerTickRate: random(0.00001, 0.00005)
  });

  function get2DPosition () {
    SceneManager.camera.updateProjectionMatrix();
    const vector = tree.position.clone().project(SceneManager.camera);
    vector.x = ((vector.x + 1) / 2) * SceneManager.screenDimensions.width - 14;
    vector.y = (-(vector.y - 1) / 2) * SceneManager.screenDimensions.height;
    return vector;
  }
  const thirstyLabel = label({
    text: "Thirsty\n",
    initialValue: treeThirsty.get().toFixed(1),
    ...get2DPosition()
  });
  const shouldShowLabel = getCapiInstance().getValue({ key: "hawkLabel" });
  if (shouldShowLabel) thirstyLabel.showLabel();

  function setLabelTo ({ visible }) {
    if (visible) thirstyLabel.showLabel();
    else thirstyLabel.hideLabel();
  }

  let lastSimTime = 0;
  function update(elapsedTime, simulationTime) {
    if(!treeDeath){
      if (deathDelta > deathTimer) {
        if(!removeLabel){
          thirstyLabel.destroy();
          removeLabel = true;
          treeDeath = true;
        }

      }
      if (treeThirsty.get() >= maxThirsty) {
        deathDelta += lastSimTime === 0 ? 0 : simulationTime - lastSimTime;
      } else if (isConsuming) {
        deathDelta = 0;
      }
      lastSimTime = simulationTime;
      const position = get2DPosition();
      treeThirsty.update(simulationTime, isConsuming);
      thirstyLabel.update(position.x, position.y, treeThirsty.get().toFixed(1));

      if (treeThirsty.get() >= maxThirsty * 0.75 && !isConsuming) {
        env.consumeWater(tree.position.x, tree.position.z ,TYPE);
        if(env.getEnvTileLevel(tree.position.x, tree.position.z) > 0){
          isConsuming = true;
        } else if (env.getEnvTileLevel(tree.position.x, tree.position.z) < 0
            && env.getEnvTileLevel(tree.position.x, tree.position.z) > -1 ) {
          isConsuming = false;
          setTreeToBrownColor();
          setTreeTo45Degree();

        }else if(env.getEnvTileLevel(tree.position.x, tree.position.z) < -15){
          setTreeToBrownColor();
          setTreeLayFlat();
          isConsuming = false;

        }

      }
      if(treeThirsty.get() <= 6){
        setTreeToGreen();
        isConsuming = false;

      }

    }


 }
  return {
    update,
    model: tree,
    created: new Date()
  };
}

export default Tree;
