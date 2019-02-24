const THREE = require("three");

export const NAME = "collision-sphere";
export const TYPE = "CollisionSphere";
function drawLine (pointA, pointB) {
  const material = new THREE.LineBasicMaterial({ color: "#0000ff" });
  const geometry = new THREE.Geometry();
  geometry.vertices.push(pointA);
  geometry.vertices.push(pointB);

  return new THREE.Line(geometry, material);
}
function CollisionSphere (targets) {
  if (!targets) targets = [];
  const color = "#00FF00";
  const size = 10;
  const geometry = new THREE.SphereGeometry(size, 6, 6);

  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.name = NAME;
  sphere.type = TYPE;
  const raycaster = new THREE.Raycaster();

  sphere.position.set(0, size * 3, 350);
  console.log(geometry.vertices);
  let origin = null;
  let collisions = [];
  geometry.computeBoundingSphere();
  const vec = geometry.vertices[0];
  const center = geometry.boundingSphere.center;

  let prev = drawLine(vec, center);

  sphere.add(prev);

  let i = 0;
  function update () {
    sphere.remove(prev);
    i = (i + 1) % geometry.vertices.length;

    prev = drawLine(geometry.vertices[i], center);
    sphere.add(prev);
    // geometry.computeBoundingSphere();
    // origin = geometry.boundingSphere.center.clone();
    // sphere.localToWorld(origin);
    // let direction = null;
    // for (let i = 0; i < geometry.vertices.length; i++) {
    //   direction = origin.distanceTo(geometry.vertices[i]);
    //   raycaster.set(origin, direction);
    // }
    // collisions = [];
  }

  return {
    update,
    model: sphere,
    created: new Date()
  };
}

export default CollisionSphere;
