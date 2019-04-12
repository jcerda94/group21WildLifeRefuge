import { getSceneManager } from "../scenes/SceneManager";
import { random, clamp } from "./helpers";

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

const randomPositionOn = (ground, fixedValues) => {
  return {
    x: randomX(ground),
    y: random(0, 100),
    z: randomZ(ground),
    ...fixedValues
  };
};

const getPositionBasedDelay = (start, end, baseSpeed = 40) => {
  const initial = new THREE.Vector3(...Object.values(start));
  const target = new THREE.Vector3(...Object.values(end));
  const minSpeed = clamp(baseSpeed + 10)({ max: 150 });
  const maxSpeed = clamp(baseSpeed - 10)({ min: 10 });
  return initial.distanceTo(target) * random(minSpeed, maxSpeed);
};

export const createHareTweens = hareMesh => {
  const SceneManager = getSceneManager();
  const { x, y, z } = hareMesh.position;
  const positionOne = randomPositionOn(SceneManager.groundSize, { y: 2 });
  const positionTwo = randomPositionOn(SceneManager.groundSize, { y: 2 });
  const positionThree = randomPositionOn(SceneManager.groundSize, { y: 2 });

  const harePosition = hareMesh.position;

  const initialHareMovement = new TWEEN.Tween(harePosition).to(
    positionOne,
    getPositionBasedDelay({ x, y, z }, positionOne)
  );

  const hareMovementOne = new TWEEN.Tween(harePosition).to(
    positionTwo,
    getPositionBasedDelay(positionOne, positionTwo)
  );
  const hareMovementTwo = new TWEEN.Tween(harePosition).to(
    positionThree,
    getPositionBasedDelay(positionTwo, positionThree)
  );
  const hareMovementThree = new TWEEN.Tween(harePosition).to(
    { x, y, z },
    getPositionBasedDelay({ x, y, z }, positionOne)
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

export const createHawkTweens = hawkMesh => {
  const SceneManager = getSceneManager();

  const { x, y, z } = hawkMesh.position;
  const positionOne = randomPositionOn(SceneManager.groundSize, { y: 100 });
  const positionTwo = randomPositionOn(SceneManager.groundSize, { y: 100 });
  const positionThree = randomPositionOn(SceneManager.groundSize, { y: 100 });

  const hawkPosition = hawkMesh.position;
  const baseSpeed = 20;

  const initialHawkMovement = new TWEEN.Tween(hawkPosition).to(
    positionOne,
    getPositionBasedDelay({ x, y, z }, positionOne, baseSpeed)
  );

  const hawkMovementOne = new TWEEN.Tween(hawkPosition).to(
    positionTwo,
    getPositionBasedDelay(positionOne, positionTwo, baseSpeed)
  );

  const hawkMovementTwo = new TWEEN.Tween(hawkPosition).to(
    positionThree,
    getPositionBasedDelay(positionTwo, positionThree, baseSpeed)
  );

  const hawkMovementThree = new TWEEN.Tween(hawkPosition).to(
    { x, y, z },
    getPositionBasedDelay(positionThree, { x, y, z }, baseSpeed)
  );

  initialHawkMovement.chain(hawkMovementOne);
  hawkMovementOne.chain(hawkMovementTwo);
  hawkMovementTwo.chain(hawkMovementThree);
  hawkMovementThree.chain(hawkMovementOne);

  hawkMovementOne.start();
  return [
    initialHawkMovement,
    hawkMovementOne,
    hawkMovementTwo,
    hawkMovementThree
  ];
};
