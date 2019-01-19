const THREE = require('three');

function DirectionalLight (scene, config = {}) {
  const directional = new THREE.DirectionalLight(0xffffff, 0.5);
  directional.position.set(1, 1, 1);
  scene.add(directional);
  function update () {}

  return {
    update
  };
}

export default DirectionalLight;
