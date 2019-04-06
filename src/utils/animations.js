import { getSceneManager } from "../scenes/SceneManager";
import { random } from "./helpers";

const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");

const randomX = SceneManager => {
  const groundX = SceneManager.groundSize.x / 2;
  return random(-groundX, groundX);
};

const randomZ = SceneManager => {
  const groundZ = SceneManager.groundSize.y / 2;
  return random(-groundZ, groundZ);
};

export const createHareTweens = hareMesh => {
  const SceneManager = getSceneManager();
  const { x, y, z } = hareMesh.position;
  const tweenPositionOne = new TWEEN.Tween(hareMesh.position).to(
    { x: x + 5, y, z: z + 5 },
    1500
  );

  let firstRandomX = randomX(SceneManager);
  let firstRandomZ = randomZ(SceneManager);

  let randomSpot = new THREE.Vector3(firstRandomX, 0, firstRandomZ);
  let randomDistance = hareMesh.position.distanceTo(randomSpot);

  const tweenPositionTwo = new TWEEN.Tween(hareMesh.position).to(
    { x: firstRandomX, y, z: firstRandomZ },
    randomDistance * 30
  );

  const secondRandomX = randomX(SceneManager);
  const secondRandomZ = randomZ(SceneManager);

  const nextRandomSpot = new THREE.Vector3(secondRandomX, 0, secondRandomZ);
  const nextRandomDistance = hareMesh.position.distanceTo(nextRandomSpot);

  const tweenPositionThree = new TWEEN.Tween(hareMesh.position).to(
    { x: secondRandomX, y, z: secondRandomZ },
    nextRandomDistance * 30
  );

  tweenPositionOne.chain(tweenPositionTwo);
  tweenPositionTwo.chain(tweenPositionThree);
  tweenPositionThree.chain(tweenPositionOne);

  tweenPositionOne.start();

  return [tweenPositionOne, tweenPositionTwo, tweenPositionThree];
};
