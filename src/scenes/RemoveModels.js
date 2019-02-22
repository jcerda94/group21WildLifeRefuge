import { getSceneManager } from "./SceneManager";
// import Hawk from "./Hawk";
// import Tree from "./Tree";
// import Hare from "./Hare";
// import Bush from "./Bush";
// import { stringify } from "querystring";

function RemoveModels (model) {
  this.state = {
    model1: model
  };
  let color = null;
  const SceneManager = getSceneManager();
  const { model1 } = this.state;

  for (var i = SceneManager.subjects.length - 1; i >= 0; i--) {
    var removeIt = false;
    switch (String(model1).trim()) {
      case "tree":
        if (SceneManager.removeAllModelsByType("Tree")) {
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
        break;
    }
  }

  function update () {}

  return {
    update
  };
}

export default RemoveModels;
