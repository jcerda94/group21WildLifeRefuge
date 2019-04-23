import Subject from "../utils/subject";
import { getCapiInstance } from "./CAPI/capi";
import { random, clamp } from "../utils/helpers";

const TWEEN = require("@tweenjs/tween.js");
const CAPI = getCapiInstance();

/**
 * This controls the generic hunger behavior of models. Its a simple implementation that increases a counter up
 * to a max value as specified. If SmartSparrow changes the metabolism for the model, this will update future
 * ticks with the new metabolism, causing the animal to become hungry faster or slower, and eat faster or slower
 *
 * Hunger ticks down if the model is eating at a rate of 4 times the provided hungerTickRate.
 *
 * @param {Object} param0 The hunger configuration object, which takes the following 4 parameters
 * @param {Number} maxHunger The maximum hunger value the model will go up to (default 20).
 * @param {Number} minHunger The minimum hunger value the model will go down to (default 1).
 * @param {Number} hungerTickRate A value controlling how much to increase hunger on every tick.
 * Defaults to 10^-4 (0.0001)
 * @param {String} type The model type to use for hunger, this lets smart sparrow control the
 * hunger tick rate via a slider.
 */
export const hunger = ({ maxHunger, minHunger, hungerTickRate, type }) => {
  const max = maxHunger || 20;
  const min = minHunger || 1;
  let tickRate = 0.0001; // hunger units per second
  if (!hungerTickRate) {
    let metabolism = CAPI.getValue({ key: `${type}.metabolism` });
    metabolism = clamp(metabolism)({ min: 2, max: 5 });
    if (!metabolism) metabolism = 2;
    tickRate = Math.pow(10, -Number(metabolism));
  }

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
      let metabolism = capiModel.get(`${type}.metabolism`);
      metabolism = clamp(metabolism)({ min: 2, max: 5 });
      tickRate = Math.pow(10, -Number(metabolism));
    };

    CAPI.addListenerFor({ key: "Hare.metabolism", callback: updateTickRate });
  }

  /**
   * Update will, unsurprisingly, update the current hunger of the model. The
   * current hunger is capped at the min and max values set when the closure is made.
   * If the model is eating, the hunger goes down, otherwise it goes up.
   *
   * @param {Number} elapsedTime The elapsed real time since the sim started
   * @param {Boolean} isEating Whether the owner of this behavior is eating or not
   */
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

/**
 * This is a convenience behavior to subscribe and unsubscribe from the
 * SceneManager pause and unpause events. This makes it so there aren't a bunch of
 * hard coded strings everywhere. It also returns a cleanup function that can be called when
 * the model is destroyed, to prevent causing memory leaks or calling handlers that no
 * longer have their associated closures.
 *
 * @param {Function} pauseHandler What to do when the simulation pauses
 * @param {Function} resumeHandler What to do when the simulation resumes
 */
export const pauseResume = (pauseHandler, resumeHandler) => {
  Subject.subscribe("simulation_paused", pauseHandler);
  Subject.subscribe("simulation_resumed", resumeHandler);

  return function cleanup () {
    Subject.unsubscribe("simulation_paused", pauseHandler);
    Subject.unsubscribe("simulation_resumed", resumeHandler);
  };
};

/**
 * The death behavior will cause a model to communicate that it should be dead, based on its starvation time.
 * The starvation time can be updated in SmartSparrow to be variable, for animals that go longer between meals
 * without consequence. This behavior only lets the model know if its dead. It does not remove or otherwise
 * affect the model.
 *
 * @param {String} type The model type to control death on
 */
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

/**
 * A simple implementation of breeding behavior for models. This behavior will run every X
 * seconds of simulation time. When a female model is ready to breed she will broadcast
 * a female event. All the males are registered for this event and will respond according
 * to their handler. By default the male hares will immediately broadcast their own event
 * saying they were present, and this will be picked up by the female hares who then run
 * their breeding handler. The female breeding handler is where the baby models come out.
 *
 * @param {Object} param0 This has multiple keys required
 * @param {String} gender This is one of {"male" | "female"}. It will control
 * how the model responds to events and whether it says "I'm ready" or finds a model
 * that has said "I'm ready"
 * @param {String} type This is the type the breeding behavior is being added to.
 * By using this type we can hook the behavior up to smart sparrow and let the ovulation
 * time be adjusted for shorter or longer breeding cycles.
 * @param {Function} breedingHandler This is the function to be run in the model's closure
 * that will tell the model what to do when a breeding event has occurred.
 * @param {Number} simulationTime The time that has elapsed in the simulation, this is used
 * to determine if another breeding cycle has happened.
 *
 */
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

/**
 * This is a simple helper function to assign genders to models based on the bias set
 * in smart sparrow. Defaults to a 50/50 split.
 * @param {Object} param0 A gender bias to create more or less female models.
 */
export const gender = ({ bias } = { bias: 50 }) => {
  const assignment = random(0, 100);
  return assignment >= bias ? "female" : "male";
};

/**
 * This is technically not a behavior, but it acts like the behaviors. It takes the model
 * and projects its position onto the 2D plane of the camera. Using that position a simple
 * HTML div is rendered with basic styling that displays a value.
 *
 * This can theoretically display anything but it gets very messy if the text is too large.
 * A better approach may be to use icons to indicate the status of animals.
 *
 * @param {Object} param0 A series of keys to configure the label used on a model
 */
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

/**
 * This flee behavior will cause the model to stop its motion and travel quickly to a position.
 * When its done, it will try to go about its business and roam again. If it is told to flee again
 * that will always take priority.
 *
 * @param {Object} model The model to move
 * @param {Object} targetPosition an Object with {x, y, z} coordinates
 * @param {Array} tweens An array of the existing tweens being used by the model
 * @param {Function} createTweens a function to create new tweens for the model
 */
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

/**
 * This will cause the model to move to food. It is similar to the flee function, however,
 * it will not start moving again until its told to start moving again.
 *
 * @param {Object} model The model to move
 * @param {Object} targetPosition an Object with {x, y, z} coordinates
 * @param {Array} normalMovementTweens An array of the existing tweens being used by the model
 * @param {Function} createTweens a function to create new tweens for the model
 */
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

/**
 * This behavior lets us watch for the presence of other animals via an observer. The watched
 * animal can broadcast its position and the watching animals can respond to those broadcasts.
 *
 * @param {Observer} observer This is used to respond to events from the given model
 * @param {Function} callback The callback is run when the event fires
 */
export const watchAnimal = (observer, callback) => {
  observer.subscribe(callback);
  return () => observer.unsubscribe(callback);
};
