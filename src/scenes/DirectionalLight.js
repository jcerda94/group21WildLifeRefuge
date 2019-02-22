const THREE = require("three");

function DirectionalLight (config = {}) {
  const directional = new THREE.DirectionalLight(0xffffff, 0.5);
  directional.position.set(1, 1, 1);
  function update () {}

  return {
    update,
    light: directional
  };
}

export default DirectionalLight;
