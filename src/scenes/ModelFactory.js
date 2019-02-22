import TreeModel from "./Tree";

const Hawk = () => {};
const Hare = () => {};
const Bush = () => {};
const Tree = () => {
  const { model, created } = TreeModel();
  return {
    update: () => {},
    model,
    created
  };
};
const Cube = () => {};
const Ground = () => {};
const Grass = () => {};

const MODEL_TYPES = {
  Hawk: {
    type: "hawk",
    model: Hawk
  },
  Hare: {
    type: "hare",
    model: Hare
  },
  Bush: {
    type: "bush",
    model: Bush
  },
  Tree: {
    type: "tree",
    model: Tree
  },
  Cube: {
    type: "cube",
    model: Cube
  },
  Ground: {
    type: "Ground",
    model: Ground
  },
  Grass: {
    type: "Grass",
    model: Grass
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

export default new modelFactory();
