import TreeModel from "./Tree";
import HawkModel from "./Hawk";
import HareModel from "./Hare";
import BushModel from "./Bush";
import CubeModel from "./Cube";
import GroundModel from "./Ground";

const Hawk = () => {
  const { model, created, update } = HawkModel();
  return {
    model,
    created,
    update
  };
};
const Hare = () => {
  const { model, created, update } = HareModel();
  return {
    model,
    created,
    update
  };
};
const Bush = () => {
  const { model, created, update } = BushModel();
  return {
    model,
    created,
    update
  };
};
const Tree = () => {
  const { model, created } = TreeModel();
  return {
    update: () => {},
    model,
    created
  };
};
const Cube = () => {
  const { model, created, update } = HareModel();
  return {
    model,
    created,
    update
  };
};
const Ground = () => {
  const { model, created, update } = HareModel();
  return {
    model,
    created,
    update
  };
};
const Grass = () => {
  const { model, created, update } = HareModel();
  return {
    model,
    created,
    update
  };
};

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
