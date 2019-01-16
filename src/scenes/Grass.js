const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

function Grass(scene, config = {}) {
  const loader = new THREE.GLTFLoader();

  loader.load(
    "models/grass.gltf",
    fbx => console.log("IMPORTED", fbx),
    undefined,
    err => console.log(err)
  );

  function update() {}
  return {
    update
  };
}

export default Grass;
