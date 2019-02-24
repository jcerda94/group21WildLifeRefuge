import { getSceneManager } from "./SceneManager";
import ModelFactory from "./ModelFactory";

function PreLoadModels ({ hawks, hares, cedars, bushes }) {
  const SceneManager = getSceneManager();
  SceneManager.addObjects({ type: "hawk", count: hawks });
  for (let i = 0; i < cedars; i++) {
    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "tree" }));
  }
  for (let i = 0; i < bushes; i++) {
    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "bush" }));
  }
  for (let i = 0; i < hares; i++) {
    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hare" }));
  }
}

export default PreLoadModels;
