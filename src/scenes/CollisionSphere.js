const THREE = require("three");

export const NAME = "collision-sphere";
export const TYPE = "CollisionSphere";

function CollisionSphere () {
  const color = "#00FF00";
  const size = 10;
  const geometry = new THREE.SphereGeometry(size, 12, 12);
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.set(0, size * 3, 350);

  sphere.name = NAME;
  sphere.type = TYPE;

  function update () {}

  return {
    update,
    model: sphere,
    created: new Date()
  };
}

export default CollisionSphere;
