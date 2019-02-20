
import { getSceneManager } from "./SceneManager";
//import Hawk from "./Hawk";
//import Tree from "./Tree";
//import Hare from "./Hare";
//import Bush from "./Bush";
//import { stringify } from "querystring";

function RemoveModels (model) {
  this.state = {
    model1: model
  };
  let color = null;
  const SceneManager = getSceneManager();
  const { model1 } = this.state;

  //    console.log("RemoveModels:  model1: " + (String)(model1));
  // find the current object(s) of the type we want to remove
    //console.log("RemoveModels:  SceneManager.subjects.length: " + SceneManager.subjects.length);
  // find the current object(s) of the type we want to remove
  for (var i = SceneManager.subjects.length - 1; i >= 0; i--) {
     //console.log("RemoveModels: current models[%d]: %s", i, (String)(model1));

    var removeIt = false;
    switch (String(model1).trim()) {
      case "tree":
        if(SceneManager.removeAllModelsByType("Tree")) {  
          removeIt = true;
        }
        break;
      case "hawk":
        if (SceneManager.removeAllModelsByType("Hawk")) {
          removeIt = true;
        }
        break;
      case "bush":
        if (SceneManager.removeAllModelsByType("Bush")) {
          removeIt = true;
        }
        break;
      case "hare":
        if (SceneManager.removeAllModelsByType("Hare")) {
          removeIt = true;
        }
        break;
      case "grass":
        if (SceneManager.removeAllModelsByType("Grass")) {
          removeIt = true;
        }
        break;
      default:
        //console.log("RemoveModels:  Unknown model: " + (String)(model1));
        break;
    }
    if (removeIt) {
      // console.log("RemoveModels: for " + (String)(model1));
      // console.log("RemoveModels: current subject count %d", SceneManager.subjects.length);
      //SceneManager.removeObject(i, SceneManager.scene.children[i]);
      // console.log("RemoveModels: current subject count %d", SceneManager.subjects.length);
    }
  }

  // console.log("RemoveModels: show current model list ===============================");
  for (var i = SceneManager.scene.children.length - 1; i >= 0; i--) {
    // console.log("RemoveModels: current models[%d]: %s", i, SceneManager.scene.children[i].type);
  }
  function update () {}

  return {
    update
  };
}

export default RemoveModels;
