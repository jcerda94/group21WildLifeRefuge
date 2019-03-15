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

    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hawk" }));
  }
  for (let i = 0; i < hares; i++) {
    SceneManager.addObject(ModelFactory.makeSceneObject({ type: "hare" }));
  }
  // for (let i = 0; i < 20; i++) {
  //  SceneManager.addObject(ModelFactory.makeSceneObject({ type: "grass" }));
  // }

  function update () {}

  return {
    update
  };
}

export default PreLoadModels;
