import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
import { getGrassLinkedList } from "../utils/LinkedList.js";
import { Node } from "../utils/LinkedList.js";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");

export const TYPE = "Grass";
const grasses = new THREE.Object3D();

async function GrassField (config) {
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onLoad = config.onLoad || (() => null);

  const loader = new THREE.GLTFLoader(loadingManager);

  const { count = 500 } = config;

  //const grasses = new THREE.Object3D();

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
  //for (let i = 0; i < 5; i++) { // testing
  
  
    const grass = originalGrass.clone();
    grass.children[0].children[0].userData = {
      selectable: true,
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
    //grass.position.set(30*i, 0, 0); // testing

    grass.rotation.y = rotation;
    const grassMesh = grass.children[0].children[0].material;
    grassMesh.color.set(grass.children[0].children[0].userData.color.original);
    grass.children[0].children[0].material = grassMesh.clone();
    grasses.add(grass);
    
    // the grasses has both an add and remove that work.
    // the plan is to store the grass objects in a linked list since we can't seem to access 'grasses' 
    //as a list or array.
    // maybe it's possible but haven't been able to.
    // should be able to create a linked list containing the grass objects.
    // Can then search this list to find the grass closest, or the right kind of grass, and move to it and eat it.
    // Then, since the grass object is on the list, we should be able to call grasses.remove(eaten_grass)

    //grasses.remove(grass);
    getGrassLinkedList().Append(new Node(grass));
  }

  grasses.type = TYPE;

  function update () {}

  return {
    update,
    model: grasses,
    created: new Date()
  };
}

export var myGrasses = function() { return grasses; };
export var findRemoveIfNear = function (animalPos, range) {
  var inPos    = JSON.parse(JSON.stringify(animalPos, null, 4)); // this seems to clean up the arguments for easier use
  var theRange = JSON.parse(JSON.stringify(range, null, 4));
  //console.log("find grass within: " + theRange + "  to  " + inPos.x.toFixed(0) + ":" 
  //                                                        + inPos.y.toFixed(0) + ":" 
  //                                                        + inPos.z.toFixed(0) );

  var ll = getGrassLinkedList();
  //console.log("list of grass length: " +  ll.length); 
  var node = ll.First();
  var shortestDist = 1000000;
  var shortestDist_node;
  for(var idx=0; idx<ll.length; idx++)
  {
    //console.log("the list of grass: " +  node.data.position.x); 
    //console.log("animalPos: " + animalPos.x.toFixed() + "   node.data.position: " + node.data.position.x.toFixed());
    var distance = getDistance(animalPos, node.data.position);
    if(shortestDist > distance.toFixed())
    {
      shortestDist = distance.toFixed();
      shortestDist_node = node;
      //console.log("new shortestDist: " + shortestDist);
    }
    //console.log("distance: " + distance);
    var next_node = ll.Next(node);
    //if(node.data.position.x === animalPos)
    node = next_node;
    //console.log("new count of grass list: " +  ll.length); 
  }
  
  console.log("======================: " + shortestDist  + "   range: " + range);

  if(shortestDist < range)
  {
    console.log("remove grass at " + shortestDist_node.data.position.x.toFixed());
    //node.data.position.x + ":" + node.data.position.y + ":"+ node.data.position.z); 
    //console.log("remove grass: " + JSON.stringify(node.data, null, 4)); 
    grasses.remove(shortestDist_node.data); 
    ll.Remove(shortestDist_node); 
    console.log("new count of grass list: " +  ll.length); 
  }
};

function calcDelta(n1, n2)
{
  if(n1 < 0 && n2 < 0) 
    return Math.abs(Math.abs(n1) - Math.abs(n2)).toFixed();
  else 
    return Math.abs(Math.abs(n1) + Math.abs(n2)).toFixed();
}
export function getDistance(pos1, pos2)
{
  // abs( -10 + 2 ) = 12
  var deltaX = calcDelta(pos1.x, pos2.x);
  var deltaY = calcDelta(pos1.y, pos2.y);
  var deltaZ = calcDelta(pos1.z, pos2.z);
  //console.log("delta1: " + pos1.x.toFixed() + ":" + pos1.y.toFixed() + ":" + pos1.z.toFixed());
  //console.log("delta2: " + pos2.x.toFixed() + ":" + pos2.y.toFixed() + ":" + pos2.z.toFixed());
  //console.log("delta: " + deltaX + ":" + deltaY + ":" + deltaZ);
  var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ , 2));
  //console.log("dist: " + dist);
  return (dist);
};
export default GrassField;
