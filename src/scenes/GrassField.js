import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { Node } from "../utils/LinkedList.js";
import { getGrassLinkedList } from "../utils/LinkedList.js";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

export const TYPE = "Grass";
const grasses = new THREE.Object3D();
async function GrassField (config) {
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = config.onLoad || (() => null);

  const loader = new THREE.GLTFLoader(loadingManager);

  const { count = 5000 } = config;

  const originalGrass = await new Promise((resolve, reject) => {
    loader.load(
      "models/grass.gltf",
      grass => resolve(grass.scene || null),
      undefined,
      reject
    );
  });

  const bounds = getSceneManager().groundSize;
  const positionBound = {
    x: bounds.x * 0.95,
    y: bounds.y * 0.95
  };

  for (let i = 0; i < count; i++) {
    // for (let i = 0; i < 15; i++) { // testing

    const grass = originalGrass.clone();
    grass.children[0].children[0].userData = {
      selectable: true,
      gender: "not available",
      eatable: true,
      color: {
        highlight: "#FFF",
        original: "#3baa5d",
        selected: "#FF00FF"
      }
    };
    const size = random(1, 2);

    const x = random(-positionBound.x / 2, positionBound.x / 2);
    const z = random(-positionBound.y / 2, positionBound.y / 2);

    const rotation = random(-Math.PI / 2, Math.PI / 2);

    grass.scale.set(size, size, size);

    grass.position.set(x, 0, z);
    // grass.position.set(3*i, 0, 0); // testing

    grass.rotation.y = rotation;
    const grassMesh = grass.children[0].children[0].material;
    grassMesh.color.set(grass.children[0].children[0].userData.color.original);
    grass.children[0].children[0].material = grassMesh.clone();
    grasses.add(grass);

    // the grasses has both an add and remove that work.
    // the plan is to store the grass objects in a linked list since we can't seem to access 'grasses'
    // as a list or array.
    // maybe it's possible but haven't been able to.
    // should be able to create a linked list containing the grass objects.
    // Can then search this list to find the grass closest, or the right kind of grass, and move to it and eat it.
    // Then, since the grass object is on the list, we should be able to call grasses.remove(eaten_grass)

    // getGrassLinkedList().Append(new Node(grass));
    // console.log(" grasses length: " + grasses.children.length);
  }

  grasses.type = TYPE;
  grasses.name = "grass";

  function update () {}

  return {
    update,
    model: grasses,
    created: new Date()
  };
}
var inPos;
var theRange;
export var myGrasses = function () {
  return grasses;
};
export var findRemoveIfNear = function (animalPos, range) {
  inPos = animalPos;
  theRange = range;

  const my_grasses = myGrasses();
  var eatingRange = 100;
  //var shortestDist = 1000000.1;
  var shortestDist_node = null;
  //var shortestDist_node_i = 0;

  for (var idx = 0; idx < my_grasses.children.length; idx++) {
    var node = my_grasses.children[idx];
    var distance = getDistance(animalPos, node.position);

    if(distance < eatingRange) { // get all the grass inside a range
      // Since the grass field is greated randomly, the first one we find is pretty random
      // so we'll use it
      grasses.remove(node);
      // console.log("new count of grass list: " +  ll.length);
      getGrassLinkedList().Append(new Node(node));
  
      //console.log("eaten grass count: " + getGrassLinkedList().length);
      if(getGrassLinkedList().length > 100) {
        //console.log("put grass back");
        var grass_node = getGrassLinkedList().First();
        grasses.add(grass_node.data);
        getGrassLinkedList().Remove(grass_node);
      }
      break;
  
    }
  }
};

function isGreaterThan (n1, n2) {
  return parseInt(n1) > parseInt(n2);
}
function getDistance (pos1, pos2) {
  return pos1.distanceTo(pos2);
}
export default GrassField;