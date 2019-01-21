const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getValue = (accessor = "", initial = {}) => {
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

module.exports = {
  random,
  getValue
};
