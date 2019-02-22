import { getSceneManager } from "./SceneManager";
import { random } from "../utils/helpers";
import ModelFactory from "./ModelFactory";

function AddModels (model) {
  this.state = {
    model1: model
  };
  let color = null;
  const SceneManager = getSceneManager();
  const { model1 } = this.state;

  switch (String(model1)) {
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

  // console.log(
  //   "AddModels:  SceneManager.groundSize.x: " + SceneManager.groundSize.x
  // );
  const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
  const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

  const x = random(-widthBound, widthBound);
  const y = 1.5;
  const z = random(-heightBound, heightBound);
  const position = { x, y, z };

  const cubeConfig = {
    size: 3,
    position,
    color
  };

  SceneManager.addObject(
    ModelFactory.makeSceneObject({ type: "cube", config: cubeConfig })
  );
  function update () {}

  return {
    update
  };
}

export default AddModels;
