import { getSceneManager } from "./SceneManager";
import Cube from "./Cube";
import { random } from "../utils/helpers";
import Hawk from "./Hawk";
import Tree from "./Tree";
import Hare from "./Hare";
import Bush from "./Bush";

function AddModels (model) {

  let color = null;
  const SceneManager = getSceneManager();

  switch (model){
    case "tree":
      SceneManager.addObject(new Tree(SceneManager.scene));
      break;
    case "hawk":
      SceneManager.addObject(new Hawk(SceneManager.scene));
      break;
    case "bush":
      SceneManager.addObject(new Bush(SceneManager.scene));
      break;
    case "hare":
      SceneManager.addObject(new Hare(SceneManager.scene));
      break;
    case "grass":
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

      SceneManager.addObject(new Cube(SceneManager.scene, cubeConfig));
      break;
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
