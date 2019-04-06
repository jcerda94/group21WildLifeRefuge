import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";

function PreLoadModels ({ hawks, hares, cedars, bushes }) {
  const SceneManager = getSceneManager();
  for (let i = 0; i < cedars; i++) {
    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "tree" }));
  }
  for (let i = 0; i < bushes; i++) {
    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "bush" }));
  }
  for (let i = 0; i < hawks; i++) {
    SceneManager.addObject(
      ModelFactory.makeSceneObject({
        type: "hawk",
        config: {
          useCollision: true,
          collision: {
            targets: ["Hare"]
          }
        }
      })
    );
  }
  for (let i = 0; i < hares; i++) {
    SceneManager.addObject(
      ModelFactory.makeSceneObject({
        type: "hare",
        config: { useCollision: true, collision: { targets: ["Grass"] } }
      })
    );
  }
  function update () {}

  return {
    update
  };
}

export default PreLoadModels;
