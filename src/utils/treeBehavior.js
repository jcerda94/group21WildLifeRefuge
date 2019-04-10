/*
    Create by: Thongphanh Duangboudda
    Date: March 16, 2019
    Reference: identical to behavior.js created by Andrew.
 */

export const waterLevel = ({ maxThirsty, minThirsty, thirstTickRate }) => {
  const max = maxThirsty || 20;
  const min = minThirsty || 1;
  const tickRate = thirstTickRate || 0.0001; // hunger units per second
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
