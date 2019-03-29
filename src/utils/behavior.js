import Subject from "../utils/subject";
import { random } from "../utils/helpers";
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

export const breed = ({ gender, type, breedingHandler, id }) => {
  const femaleEvent = `${type}_ovulation`;
  const maleEvent = `${type}_unload`;

  if (gender === "male") {
    let hasBred = false;
    const breedWrapper = (...args) => {
      breedingHandler(...args);
      Subject.next(maleEvent);
    };
    Subject.subscribe(femaleEvent, breedWrapper);

    return {
      signal: () => {
        Subject.next(maleEvent);
      },
      cleanup: () => Subject.unsubscribe(femaleEvent, breedWrapper),
      reset: () => {
        hasBred = false;
      }
    };
  } else {
    let hasBred = false;
    const breedWrapper = (...args) => {
      if (!hasBred) {
        breedingHandler(...args);
        hasBred = true;
      }
    };
    Subject.subscribe(maleEvent, breedWrapper);

    return {
      signal: () => {
        Subject.next(femaleEvent, { id });
      },
      cleanup: () => {
        Subject.unsubscribe(maleEvent, breedWrapper);
      },
      reset: () => {
        hasBred = false;
      }
    };
  }
};

export const gender = ({ bias } = { bias: 50 }) => {
  const assignment = random(0, 100);
  return assignment >= bias ? "female" : "male";
};

export const label = ({ text, initialValue, x, y }) => {
  const label = document.createElement("div");
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

  function hideLabel () {
    label.style.display = "none";
  }

  function showLabel () {
    label.style.display = "flex";
  }

  function destroy () {
    if (label.parentElement && label.parentElement.hasChildNodes()) {
      label.parentElement.removeChild(label);
    }
  }

  return {
    update,
    hideLabel,
    showLabel,
    destroy
  };
};
