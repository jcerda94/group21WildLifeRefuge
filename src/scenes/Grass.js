const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/GLTFLoader')

async function Grass (scene, config = {}) {
  const loader = new THREE.GLTFLoader()

  let grass = await new Promise((resolve, reject) => {
    loader.load('models/grass.gltf', resolve, undefined, reject)
  })

  console.log(grass)
  if (grass) scene.add(grass.scene)

  function update () {}

  return {
    update
  }
}

export default Grass
