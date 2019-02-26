import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";

function AddModels (type) {
  const SceneManager = getSceneManager();

  switch (type) {
    case "tree":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "tree" }));
      return;
    case "hawk":
      const hawk = ModelFactory.makeSceneObject({
        type,
        config: {
          useCollision: true,
          collision: {
            targets: ["Hare"]
          }
        }
      });

      SceneManager.addObject(hawk);
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
