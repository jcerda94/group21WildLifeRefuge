const THREE = require('three');

function AmbientLight (scene, config = {}) {
  const ambientLight = new THREE.AmbientLight(0x808080);

  scene.add(ambientLight);

  function update () {}

  return {
    update
  };
}

export default AmbientLight;
