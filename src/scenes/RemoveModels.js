import { getSceneManager } from "./SceneManager";

function RemoveModels (model) {
  const SceneManager = getSceneManager();

  for (let i = SceneManager.subjects.length - 1; i >= 0; i--) {
    switch (String(model).trim()) {
      case "tree":
        SceneManager.removeAllModelsByType("Tree");
        break;
      case "hawk":
        SceneManager.removeAllModelsByType("Hawk");
        break;
      case "bush":
        SceneManager.removeAllModelsByType("Bush");
        break;
      case "hare":
        SceneManager.removeAllModelsByType("Hare");
        break;
      case "grass":
        SceneManager.removeAllModelsByType("Grass");
        break;
      default:
        break;
    }
  }
}

export default RemoveModels;
