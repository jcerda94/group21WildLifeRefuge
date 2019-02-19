const Hawk = () => {};
const Hare = () => {};
const Bush = () => {};
const Tree = () => {};

const MODEL_TYPES = {
  Hawk: {
    type: "hawk",
    model: Hawk
  },
  Hawk: {
    type: "hare",
    model: Hare
  },
  Hawk: {
    type: "bush",
    model: Bush
  },
  Hawk: {
    type: "tree",
    model: Tree
  },
  Cube: {
    type: "cube",
    model: Cube
  }
};

class modelFactory {
  makeSceneObject (options) {
    const { type } = options;
    switch (type) {
      case MODEL_TYPES.Hawk.type:
        return MODEL_TYPES.Hawk.model();
      case MODEL_TYPES.Hare.type:
        return MODEL_TYPES.Hare.model();
      case MODEL_TYPES.Bush.type:
        return MODEL_TYPES.Bush.model();
      case MODEL_TYPES.Tree.type:
        return MODEL_TYPES.Tree.model();
      default:
        return MODEL_TYPES.Cube.model();
    }
  }
}
