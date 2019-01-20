import * as THREE from "three";

function Ground (scene, config) {
  const { size = { x: 100, y: 100 }, color = "#996600" } = config;
  const depth = 15;
  const geometry = new THREE.BoxBufferGeometry(size.x, depth, size.y);
  const material = new THREE.MeshPhongMaterial({
    color: "#996600"
  });

  geometry.computeFaceNormals();
  geometry.normalsNeedUpdate = true;

  const ground = new THREE.Mesh(geometry, material);
  ground.position.set(0, -depth / 2, 0);
  ground.type = "Ground";
  scene.add(ground);

  function update (time) {}

  return {
    update
  };
}

export default Ground;
