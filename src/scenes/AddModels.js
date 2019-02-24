import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";

function AddModels (model) {
  const SceneManager = getSceneManager();

  switch (String(model)) {
    case "tree":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "tree" }));
      return;
    case "hawk":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hawk" }));
      return;
    case "bush":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "bush" }));
      return;
    case "hare":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hare" }));

    default:
      break;
  }
}

export default AddModels;
