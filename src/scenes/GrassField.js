const THREE = (window.THREE = require('three'));
require('three/examples/js/loaders/GLTFLoader');

function random (min, max) {
  return Math.random() * (max - min) + min;
}

async function GrassField (scene, config = { count: 500 }) {
  const loader = new THREE.GLTFLoader();
  const { count } = config;

  const grasses = new THREE.Object3D();
  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      'models/grass.gltf',
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });
  for (let i = 0; i < count; i++) {
    const grass = originalGrass.clone();
    if (grass) {
      grass.children[0].children[0].material.color = new THREE.Color('#3baa5d');
      if (i === 0) console.log(grass);
      const size = random(1, 2);
      const x = random(-48, 48);
      const z = random(-48, 48);

      grass.scale.set(size, size, size);
      grass.position.set(x, 0, z);
      grasses.add(grass);
    }
  }

  scene.add(grasses);

  function update () {}

  return {
    update
  };
}

export default GrassField;
