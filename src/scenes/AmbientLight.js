const THREE = require("three");

function AmbientLight (config = {}) {
  const ambientLight = new THREE.AmbientLight(0x808080);
  ambientLight.castShadow = true;

  function update () {}

  return {
    update,
    light: ambientLight
  };
}

export default AmbientLight;
