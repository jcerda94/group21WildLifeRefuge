import { getSceneManager } from "./SceneManager";
import { random } from "../utils/helpers";
import ModelFactory from "./ModelFactory";

var hareCount = 0;
function AddModels (model) {
  let color = null;
  const SceneManager = getSceneManager();

  switch (String(model)) {
    case "tree":
      color = "#00C060";
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "tree" }));
      return;
    case "hawk":
      color = 0xcc0000;
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hawk" }));
      return;
    case "bush":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "bush" }));
      color = 0x669900;
      return;
    case "hare":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hare" }));
      color = 0xd9d9d9;
      return;

    default:
      // grass isn't handled
      //      console.log("AddModels:  Unknown model: " + (String)(model1));
      break;
  }

  function update () {}

  return {
    update
  };
}

export default AddModels;
