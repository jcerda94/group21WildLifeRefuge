import { getSceneManager } from "../scenes/SceneManager";
export const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min, max) => {
  min = parseInt(min);
  max = parseInt(max);
  return Math.floor(Math.random() * max) + min;
};

export const get2DPosition = model => {
  const SceneManager = getSceneManager();
  SceneManager.camera.updateProjectionMatrix();
  const vector = model.position.clone().project(SceneManager.camera);
  vector.x = ((vector.x + 1) / 2) * SceneManager.screenDimensions.width - 14;
  vector.y = (-(vector.y - 1) / 2) * SceneManager.screenDimensions.height;
  return vector;
};

export const findClosestModel = (type, currentPosition) => {
  const SceneManager = getSceneManager();
  const models = SceneManager.getSceneObjectsOf({ types: [type] });

  if (!Array.isArray(models)) return {};
  return models.reduce(
    (acc, model, index) => {
      const distance = currentPosition.distanceTo(model.position);
      if (distance < acc.distance) {
        acc.distance = distance;
        acc.model = model;
      }
      return acc;
    },
    { distance: Number.MAX_VALUE, model: null }
  );
};

export const getValue = (accessor = "", initial = {}) => {
  if (initial === null) {
    throw new Error(`Cannot access ${accessor} on null initial value`);
  }
  if (accessor === null) {
    throw new Error("Cannot access null property of an object");
  }

  return accessor.split(".").reduce((accum, accessor, i, arr) => {
    const val = accum[accessor];
    const valueIsLast = arr.length - 1 === i;

    if (valueIsLast) {
      return val;
    }

    return val || {};
  }, initial);
};
