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

  let currentHunger = parseInt((max - min) / 2);
  let lastUpdateTime = 0;

  function update (elapsedTime, isEating) {
    const delta = elapsedTime - lastUpdateTime;

    if (isEating) {
      currentHunger -= delta * tickRate * 4;
    } else {
      currentHunger += delta * tickRate;
    }

    if (currentHunger > max) currentHunger = max;
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

  return {
    update,
    hideLabel,
    showLabel
  };
};
