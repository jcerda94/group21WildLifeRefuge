import Subject from "../utils/subject";
import { getCapiInstance } from "./CAPI/capi";
import { random } from "../utils/helpers";

const CAPI = getCapiInstance();

export const hunger = ({ maxHunger, minHunger, hungerTickRate }) => {
  const max = maxHunger || 20;
  const min = minHunger || 1;
  const tickRate = hungerTickRate || 0.0001; // hunger units per second
  if (min < 1) {
    throw new Error("Minimum hunger value must be >= 1");
  }

  if (max < min) {
    throw new Error("Maximum hunger value must be > minimum hunger value");
  }

  let currentHunger = max * 0.5;
  let lastUpdateTime = 0;

  function update (elapsedTime, isEating) {
    const delta = elapsedTime - lastUpdateTime;

    if (isEating) {
      currentHunger -= delta * tickRate * 4;
    } else {
      currentHunger += delta * tickRate;
    }

    if (currentHunger > max) currentHunger = max;
    if (currentHunger < min) currentHunger = min;
    lastUpdateTime = elapsedTime;
  }

  function get () {
    return currentHunger;
  }

  return {
    update,
    get
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
