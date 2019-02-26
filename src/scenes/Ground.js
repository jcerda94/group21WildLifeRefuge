import ground from '../assets/groundTexture.jpg'
const THREE = require("three");

export const TYPE = "Ground";

function Ground (config) {
  const { size = { x: 100, y: 100 }, color = "#996600" } = config;
  const depth = 15;
  const geometry = new THREE.BoxBufferGeometry(size.x, depth, size.y);

  const material = [
    new THREE.MeshLambertMaterial({
      color
    }),
      new THREE.MeshLambertMaterial({
        color
      }),
    new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader().load(ground)
    }),
    new THREE.MeshLambertMaterial({
      color
    }),
    new THREE.MeshLambertMaterial({
      color
    }),
    new THREE.MeshLambertMaterial({
      color
    })
  ];



  geometry.computeFaceNormals();
  geometry.normalsNeedUpdate = true;

  const ground = new THREE.Mesh(geometry, material);
  ground.position.set(0, -depth / 2, 0);
  ground.receiveShadow = true;

  ground.castShadow = true;

  ground.type = TYPE;

  function update (time) {}

  return {
    update,
    model: ground,
    created: new Date()
  };
}

export default Ground;
