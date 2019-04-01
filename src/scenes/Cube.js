const THREE = require("three");

export const NAME = "cube";
export const TYPE = "Cube";
function Cube (config) {
  const {
    color = "#0080FF",
    size = 3,
    position = { x: 0, y: 0, z: 0 }
  } = config;

  const geometry = new THREE.CubeGeometry(size, size * 3, size);
  const material = new THREE.MeshBasicMaterial({ color });
  material.side = THREE.DoubleSide;
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  cube.userData = {
    selectable: true,
    gender: "not available",
    color: {
      original: color,
      highlight: "#f7ff6d",
      selected: "#000"
    },
    name: NAME
  };
  cube.name = NAME;
  cube.type = TYPE;

  function update (elapsedTime) {}

  return {
    update,
    model: cube,
    created: new Date()
  };
}

export default Cube;
