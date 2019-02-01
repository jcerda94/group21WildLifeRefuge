const THREE = require("three");

async function Cube (scene, config, newName) {
  const {
    color = "#0080FF",
    size = 3,
    name = newName,
    position = { x: 0, y: 0, z: 0 }
  } = config;

  const geometry = new THREE.CubeGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  cube.name = newName;
  cube.userData = {
    selectable: true,
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#000"
    }
  };

  scene.add(cube);
  function update () {}

  return {
    update
  };
}

export default Cube;
