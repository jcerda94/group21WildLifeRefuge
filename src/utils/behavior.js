import Subject from "../utils/subject";
import { getCapiInstance } from "./CAPI/capi";
import { random, clamp } from "../utils/helpers";
import { getHawkObserver } from "../scenes/observer.js";
import { createHareTweens } from "../utils/animations";

const TWEEN = require("@tweenjs/tween.js");
const CAPI = getCapiInstance();

export const hunger = ({ maxHunger, minHunger, hungerTickRate, type }) => {
  const max = maxHunger || 20;
  const min = minHunger || 1;
  let tickRate = hungerTickRate || 0.0001; // hunger units per second
  if (min < 1) {
    throw new Error("Minimum hunger value must be >= 1");
  }

  if (max < min) {
    throw new Error("Maximum hunger value must be > minimum hunger value");
  }

  let currentHunger = 0.5 * max;
  let lastUpdateTime = null;

  if (type) {
    const updateTickRate = capiModel => {
      let exponent = capiModel.get(`${type}.metabolism`);
      clamp(exponent)({ min: 2, max: 4 });
      tickRate = Math.pow(10, -Number(exponent));
    };

    CAPI.addListenerFor({ key: "Hare.metabolism", callback: updateTickRate });
  }

  function update (elapsedTime, isEating) {
    if (lastUpdateTime === null) lastUpdateTime = elapsedTime;
    const delta = elapsedTime - lastUpdateTime;

    if (isEating) {
      currentHunger -= delta * tickRate * 4;
    } else {
      currentHunger += delta * tickRate;
    }

    if (currentHunger > max) currentHunger = max;
    if (currentHunger < min) currentHunger = min;
    lastUpdateTime = elapsedTime;
    return currentHunger;
  }

  function get () {
    return currentHunger;
  }

  return {
    update,
    get,
    max,
    min
  };
};

export const pauseResume = (pauseHandler, resumeHandler) => {
  Subject.subscribe("simulation_paused", pauseHandler);
  Subject.subscribe("simulation_resumed", resumeHandler);

  return function cleanup () {
    Subject.unsubscribe("simulation_paused", pauseHandler);
    Subject.unsubscribe("simulation_resumed", resumeHandler);
  };
};

export const death = type => {
  const CAPI = getCapiInstance();
  let lastSimTime = null;
  let deathDelta = 0;
  const starvationTime =
    CAPI.getValue({ key: `${type}.starvationTime` }) || 86400;

  const isDead = (simulationTime, hunger, isEating) => {
    if (lastSimTime === null) lastSimTime = simulationTime;
    if (hunger.get() >= hunger.max) {
      deathDelta += lastSimTime === null ? 0 : simulationTime - lastSimTime;
    } else if (isEating) {
      deathDelta = 0;
    }
    lastSimTime = simulationTime;

    const isDead = deathDelta > starvationTime;
    return isDead;
  };

  return {
    isDead
  };
};

export const breed = ({ gender, type, breedingHandler, simulationTime }) => {
  const femaleEvent = `${type}_ovulation`;
  const maleEvent = `${type}_unload`;
  let lastBreedTime = null;
  let ovulationTime = CAPI.getValue({ key: `${type}.ovulationTime` });
  CAPI.addListenerFor({
    key: `${type}.ovulationTime`,
    callback: capiModel => {
      ovulationTime = capiModel.get(`${type}.ovulationTime`);
    }
  });

  if (gender === "male") {
    const breedWrapper = (...args) => {
      // Can optionally call a handler for male hares here
      Subject.next(maleEvent);
    };
    Subject.subscribe(femaleEvent, breedWrapper);

    return {
      signal: () => {
        Subject.next(maleEvent);
      },
      cleanup: () => Subject.unsubscribe(femaleEvent, breedWrapper)
    };
  } else {
    let hasBred = false;
    let canBreed = false;
    const breedWrapper = (...args) => {
      if (!hasBred && canBreed) {
        breedingHandler(...args);
        hasBred = true;
        canBreed = false;
      }
    };
    Subject.subscribe(maleEvent, breedWrapper);

    return {
      signal: simulationTime => {
        if (!lastBreedTime) lastBreedTime = simulationTime;
        const elapsedTime = simulationTime - lastBreedTime;

        if (elapsedTime > ovulationTime) {
          canBreed = true;
          hasBred = false;
          lastBreedTime = simulationTime;
          Subject.next(femaleEvent);
        }
      },
      cleanup: () => {
        Subject.unsubscribe(maleEvent, breedWrapper);
      },
      isReady: simulationTime => {
        return simulationTime - lastBreedTime > ovulationTime;
      }
    };
  }
};

export const gender = ({ bias } = { bias: 50 }) => {
  const assignment = random(0, 100);
  return assignment >= bias ? "female" : "male";
};

export const label = ({ text, initialValue, x, y, type }) => {
  const label = document.createElement("div");
  const labelName = `${type}.label`;
  label.style.position = "absolute";
  label.style.width = "60px";

  label.style.backgroundColor = "#30303080";
  label.style.borderRadius = "0.25em";
  label.style.display = "none";
  label.style.alignItems = "center";
  label.style.justifyContent = "center";
  label.style.color = "#FFFFFF";
  label.innerHTML = `${text}${initialValue}`;

  label.style.top = y + "px";
  label.style.left = x + "px";
  document.body.appendChild(label);

  function update (x, y, value) {
    label.style.top = `${y}px`;
    label.style.left = `${x}px`;
    label.innerHTML = `${text}${value}`;
  }

  const hideLabel = () => {
    label.style.display = "none";
  };

  const showLabel = () => {
    label.style.display = "flex";
  };

  function destroy () {
    if (label.parentElement && label.parentElement.hasChildNodes()) {
      label.parentElement.removeChild(label);
    }
  }

  const toggleLabel = capiModel => {
    if (capiModel.get(labelName)) {
      showLabel();
    } else {
      hideLabel();
    }
  };

  CAPI.addListenerFor({ key: labelName, callback: toggleLabel });

  return {
    update,
    hideLabel,
    showLabel,
    destroy
  };
};

export const fleeToPosition = (model, targetPosition, tweens, createTweens) => {
  let fleeing = false;

  if (!fleeing) {
    const currentPosition = model.position;
    const distance = currentPosition.distanceTo(targetPosition);

    const { x, y, z } = targetPosition;
    const moveToPosition = new TWEEN.Tween(currentPosition).to(
      { x, y, z },
      distance * random(10, 30)
    );
    tweens.forEach(tween => {
      if (tween.isPlaying()) tween.stop();
    });

    moveToPosition.start();
    fleeing = true;

    moveToPosition.onComplete(() => {
      fleeing = false;
      moveToPosition.stop();
      tweens.forEach(tween => TWEEN.remove(tween));
      tweens.length = 0;
      tweens.push(...createTweens(model));
    });
    return moveToPosition;
  }
};

export const moveToFood = (
  model,
  targetPosition,
  normalMovementTweens,
  createTweens
) => {
  let gettingFood = false;

  if (!gettingFood) {
    const currentPosition = model.position;
    const distance = currentPosition.distanceTo(targetPosition);

    const { x, y, z } = targetPosition;
    const foodPositionTween = new TWEEN.Tween(currentPosition).to(
      { x, y, z },
      distance * random(10, 30)
    );

    normalMovementTweens.forEach(tween => tween.stop());
    normalMovementTweens.length = 0;
    normalMovementTweens.push(foodPositionTween);
    foodPositionTween.start();
    gettingFood = true;

    const finishFoodMovement = () => {
      gettingFood = false;
      foodPositionTween.stop();
    };

    foodPositionTween.onComplete(() => {
      finishFoodMovement();
    });
  }
};

export const watchAnimal = (observer, callback) => {
  const CAPI = getCapiInstance();

  observer.subscribe(callback);

  return () => observer.unsubscribe(callback);
};
