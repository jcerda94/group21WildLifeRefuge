const THREE = require("three");

function SpotLight (config = {}) {
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(500, 150, 500);
  spotLight.shadow.camera.near = 20;
  spotLight.shadow.camera.far = 50;
  spotLight.castShadow = true;

  function update () {}

  return {
    update,
    light: spotLight
  };
}

export default SpotLight;
