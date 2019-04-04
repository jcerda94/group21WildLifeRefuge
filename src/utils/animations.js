const TWEEN = require("@tweenjs/tween.js");

export const animate = ({ model, to, options = {} }) => {
  if (!model || !to) {
    throw new TypeError(
      `Invalid arguments provided to animate function: ${(model, to, options)}`
    );
  }
  const easing = options.easing || TWEEN.Easing.Quadratic.In;
  const duration = options.duration || 2000;

  const animateModel = new TWEEN.Tween(model.position)
    .to({ x: to.x, y: to.y, z: to.z }, duration)
    .easing(easing)
    .onUpdate(newPosition => {
      options.update && options.update(newPosition);
    })
    .onComplete(() => {
      options.callback && options.callback();
    });
  animateModel.start();
  return animateModel;
};
