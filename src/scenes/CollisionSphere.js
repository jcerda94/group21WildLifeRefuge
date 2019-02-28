import { getSceneManager } from "./SceneManager";
const THREE = require("three");
const uniqBy = require("lodash.uniqby");

export const NAME = "collision-sphere";
export const TYPE = "CollisionSphere";

function CollisionSphere (parent) {
  return function ({ targets }) {
    if (!targets) targets = [];
    const geometry = new THREE.SphereGeometry(1, 6, 6);

    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      transparent: true
    });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.name = NAME;
    sphere.type = TYPE;
    const raycaster = new THREE.Raycaster();
    raycaster.far = 10;

    parent.model.add(sphere);
    let collisions = [];
    const SceneManager = getSceneManager();
    let sceneObjects = null;
    const update = () => {
      parent.update();
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
      if (didCollide && parent.handleCollision) {
        parent.handleCollision(uniqBy(collisions, "object"));
      }
      collisions = [];
    };

    return {
      update,
      model: parent.model,
      created: parent.created
    };
  };
}

export default CollisionSphere;
