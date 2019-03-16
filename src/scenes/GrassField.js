import { random } from "../utils/helpers";
import SceneManager, { getSceneManager } from "./SceneManager";
//import { getSceneManager } from "./SceneManager";
//import { getGrassLinkedList } from "../utils/LinkedList.js";
import { Node } from "../utils/LinkedList.js";

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
  bounds.x *= 0.95;
  bounds.y *= 0.95;

  for (let i = 0; i < count; i++) {
    // for (let i = 0; i < 15; i++) { // testing

    const grass = originalGrass.clone();
    grass.children[0].children[0].userData = {
      selectable: true,
      eatable: true,
      color: {
        highlight: "#FFF",
        original: "#3baa5d",
        selected: "#FF00FF"
      }
    };
    const size = random(1, 2);

    const x = random(-bounds.x / 2, bounds.x / 2);
    const z = random(-bounds.y / 2, bounds.y / 2);

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

    //getGrassLinkedList().Append(new Node(grass));
    //console.log(" grasses length: " + grasses.children.length); 
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
  //console.log(" my_grasses length: " + my_grasses.children.length); // <<< defined
  //console.log(" my_grasses count: " + my_grasses.children.count);   // <<< undefined
  
  var shortestDist = 1000000.1;
  var shortestDist_node;
  var shortestDist_node_i = 0;

  for(var idx=0; idx < my_grasses.children.length; idx++){

    var node = my_grasses.children[idx];
    var distance = getDistance(animalPos, node.position);
    if(isGreaterThan(shortestDist.toFixed(), distance.toFixed()))
    //if(shortestDist.toFixed() > distance.toFixed())  // <<< fails w/o error, just doesn't do compare, likely as toFixed returns string
    //if(shortestDist > distance) // <<< fails w/o error, just doesn't do comparison correctly
    {
      shortestDist = distance;
      shortestDist_node = node;
      shortestDist_node_i = idx;
      // console.log("[" + idx + "] ------ grass at " + shortestDist_node.data.position.x.toFixed()
      //           + "   new shortestDist: " + shortestDist.toFixed());
    }
  }

  if (shortestDist < range) {
    console.log(
      "remove [" +
        shortestDist_node_i +
        "] at " +
        shortestDist_node.position.x.toFixed() +
        ":" +
        shortestDist_node.position.y.toFixed() +
        ":" +
        shortestDist_node.position.z.toFixed() +
        // + "        within: " + theRange + "  to  "
        "    dist: " +
        shortestDist.toFixed() +
        "    animal Pos: " +
        inPos.x.toFixed(0) +
        ":" +
        inPos.y.toFixed(0) +
        ":" +
        inPos.z.toFixed(0)
    );
    grasses.remove(shortestDist_node);
    // console.log("new count of grass list: " +  ll.length);
  }
};

function isGreaterThan (n1, n2) {
  return parseInt(n1)
       > parseInt(n2);
}
export function getDistance(pos1, pos2)
{
  var dist = 1.0;
  var deltaX = parseInt(pos1.x)
             - parseInt(pos2.x); 
  var deltaY = parseInt(pos1.y)
             - parseInt(pos2.y); 
  var deltaZ = parseInt(pos1.z)
             - parseInt(pos2.z); 
  dist = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY) + (deltaZ*deltaZ));
  return (dist);
};
export default GrassField;
