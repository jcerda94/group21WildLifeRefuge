import { getSceneManager } from "./SceneManager";
const THREE = require("three");

export const NAME = "collision-sphere";
export const TYPE = "CollisionSphere";

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

  sphere.position.set(0, 30, 350);
  let collisions = [];
  const SceneManager = getSceneManager();
  let sceneObjects = null;
  function update () {
    geometry.computeBoundingSphere();
    const origin = geometry.boundingSphere.center.clone();
    sphere.localToWorld(origin);
    sceneObjects = SceneManager.getSceneObjectsOf({ type: "Cube" });

    for (let i = 0; i < geometry.vertices.length; i++) {
      raycaster.set(origin, geometry.vertices[i].normalize());
      collisions = [];
      raycaster.intersectObjects(sceneObjects, true, collisions);
    }
  }

  return {
    update,
    model: sphere,
    created: new Date()
  };
}

export default CollisionSphere;
