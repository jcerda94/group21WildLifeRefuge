import { getSceneManager } from "./SceneManager";
const THREE = require("three");
const uniqBy = require("lodash.uniqby");

export const NAME = "collision-sphere";
export const TYPE = "CollisionSphere";

function CollisionSphere (parent) {
  return function ({ targets, handleCollision }) {
    if (!targets) targets = [];
    const color = "#00FF00";
    const size = 10;
    const geometry = new THREE.SphereGeometry(1, 6, 6);

    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0
    });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.name = NAME;
    sphere.type = TYPE;
    const raycaster = new THREE.Raycaster();
    raycaster.far = 10;

    sphere.position.set(0, 30, 350);
    let collisions = [];
    const SceneManager = getSceneManager();
    let sceneObjects = null;
    function update () {
      geometry.computeBoundingSphere();
      const origin = geometry.boundingSphere.center.clone();
      sphere.localToWorld(origin);
      sceneObjects = SceneManager.getSceneObjectsOf({ types: targets });

      let didCollide = false;
      for (let i = 0; i < geometry.vertices.length; i++) {
        raycaster.set(origin, geometry.vertices[i].normalize());
        raycaster.intersectObjects(sceneObjects, true, collisions);
        if (!didCollide && collisions.length > 0) didCollide = true;
      }
      if (didCollide) {
        handleCollision && handleCollision(uniqBy(collisions, "object"));
      }
      collisions = [];
    }

    return {
      update,
      model: sphere,
      created: new Date()
    };
  };
}

export default CollisionSphere;
