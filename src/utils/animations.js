import { getSceneManager } from "../scenes/SceneManager";
import { random } from "./helpers";

const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

const randomX = groundSize => {
  const groundX = groundSize.x / 2;
  return random(-groundX, groundX);
};

const randomZ = groundSize => {
  const groundZ = groundSize.y / 2;
  return random(-groundZ, groundZ);
};

const randomPositionOn = ground => {
  return {
    x: randomX(ground),
    y: 2,
    z: randomZ(ground)
  };
};

const getPositionBasedDelay = (start, end) => {
  const initial = new THREE.Vector3(...Object.values(start));
  const target = new THREE.Vector3(...Object.values(end));
  return initial.distanceTo(target) * 30;
};

export const createHareTweens = hareMesh => {
  const SceneManager = getSceneManager();
  const { x, y, z } = hareMesh.position;
  const positionOne = randomPositionOn(SceneManager.groundSize);
  const positionTwo = randomPositionOn(SceneManager.groundSize);
  const positionThree = randomPositionOn(SceneManager.groundSize);

  const harePosition = hareMesh.position;

  const initialHareMovement = new TWEEN.Tween(harePosition).to(
    positionOne,
    getPositionBasedDelay({ x, y, z }, positionOne)
  );

  const hareMovementOne = new TWEEN.Tween(harePosition).to(
    positionOne,
    getPositionBasedDelay(positionThree, positionOne)
  );
  const hareMovementTwo = new TWEEN.Tween(harePosition).to(
    positionTwo,
    getPositionBasedDelay(positionOne, positionTwo)
  );
  const hareMovementThree = new TWEEN.Tween(harePosition).to(
    positionThree,
    getPositionBasedDelay(positionTwo, positionThree)
  );

  initialHareMovement.chain(hareMovementOne);

  hareMovementOne.chain(hareMovementTwo);
  hareMovementTwo.chain(hareMovementThree);
  hareMovementThree.chain(hareMovementOne);

  hareMovementOne.start();

  return [
    initialHareMovement,
    hareMovementOne,
    hareMovementTwo,
    hareMovementThree
  ];
};
