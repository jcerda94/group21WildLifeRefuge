import { random } from "../utils/helpers";
const THREE = require("three");

async function Cube(scene, config) {
  const {
    color = "#0080FF",
    size = 3,
    position = { x: 0, y: 0, z: 0 }
  } = config;

  const geometry = new THREE.CubeGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);

  scene.add(cube);
  function update() {}

  return {
    update
  };
}

export default Cube;
