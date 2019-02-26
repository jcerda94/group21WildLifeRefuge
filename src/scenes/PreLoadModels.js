import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";

function PreLoadModels ({ hawks, hares, cedars, bushes }) {
  const SceneManager = getSceneManager();
  SceneManager.addObjects({
    type: "hawk",
    count: hawks,
    config: {
      useCollision: true,
      collision: {
        targets: ["Hare"]
      }
    }
  });
  SceneManager.addObjects({ type: "tree", count: cedars });
  SceneManager.addObjects({
    type: "hare",
    count: hares,
    config: { useCollision: true }
  });
  SceneManager.addObjects({ type: "bush", count: bushes });
}

export default PreLoadModels;
