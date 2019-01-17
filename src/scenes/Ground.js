import * as THREE from 'three'

function Ground (scene, config = {}) {
  const { size = { x: 10, y: 100 }, color = '#996600' } = config

  const geometry = new THREE.PlaneGeometry(size.x, size.y, 10, 10)
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    side: THREE.DoubleSide
  })

  const ground = new THREE.Mesh(geometry, material)
  ground.rotation.x = -(Math.PI / 2)
  scene.add(ground)

  function update (time) {
    ground.scale.set(size.x, 1, size.y)
  }

  return {
    update
  }
}

export default Ground
