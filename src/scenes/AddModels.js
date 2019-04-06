import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";

function AddModels (type) {
  const SceneManager = getSceneManager();

  switch (type) {
    case "tree":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "tree" }));
      break;
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
      break;
    case "bush":
      SceneManager.addObject(ModelFactory.makeSceneObject({ type: "bush" }));
      break;
    case "hare":
      SceneManager.addObject(
        ModelFactory.makeSceneObject({
          type,
          config: {
            useCollision: true,
            collision: {
              targets: ["Grass"]
            }
          }
        })
      );
      break;
    default:
  }
}

export default AddModels;
