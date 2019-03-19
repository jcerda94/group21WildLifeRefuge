import TreeModel from "./Tree";
import CollisionSphereModel from "./CollisionSphere";
import HawkModel from "./Hawk";
import HareModel from "./Hare";
import BushModel from "./Bush";
import CubeModel from "./Cube";
import GroundModel from "./Ground";
import GrassField from "./GrassField";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import SpotLight from "./SpotLight";

const Hawk = config => {
  if (config && config.useCollision) {
    const hawk = HawkModel(config);
    return CollisionSphereModel(hawk)(config.collision);
  } else {
    return HawkModel(config);
  }
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
  return TreeModel();
};
const Cube = config => {
  const { model, created, update } = CubeModel(config);
  return {
    model,
    created,
    update
  };
};
const Ground = config => {
  const { model, created, update } = GroundModel(config);
  return {
    model,
    created,
    update
  };
};
const Grass = async config => {
  const { model, created, update } = await GrassField(config);
  return {
    model,
    created,
    update
  };
};
const Ambient = () => {
  const { light, update } = AmbientLight();
  return {
    model: light,
    created: new Date(),
    update
  };
};
const Directional = () => {
  const { light, update } = DirectionalLight();
  return {
    model: light,
    created: new Date(),
    update
  };
};
const Spot = () => {
  const { light, update } = SpotLight();
  return {
    model: light,
    created: new Date(),
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
    type: "ground",
    model: Ground
  },
  Grass: {
    type: "grassField",
    model: Grass
  },
  Ambient: {
    type: "ambientLight",
    model: Ambient
  },
  Directional: {
    type: "directionalLight",
    model: Directional
  },
  Spot: {
    type: "spotLight",
    model: Spot
  }
};

class modelFactory {
  makeSceneObject (options) {
    const { type, config } = options;
    switch (type) {
      case MODEL_TYPES.Hawk.type:
        return MODEL_TYPES.Hawk.model(config);
      case MODEL_TYPES.Hare.type:
        return MODEL_TYPES.Hare.model();
      case MODEL_TYPES.Bush.type:
        return MODEL_TYPES.Bush.model();
      case MODEL_TYPES.Tree.type:
        return MODEL_TYPES.Tree.model();
      case MODEL_TYPES.Grass.type:
        return MODEL_TYPES.Grass.model(config);
      case MODEL_TYPES.Ground.type:
        return MODEL_TYPES.Ground.model(config);
      case MODEL_TYPES.Ambient.type:
        return MODEL_TYPES.Ambient.model();
      case MODEL_TYPES.Spot.type:
        return MODEL_TYPES.Spot.model();
      case MODEL_TYPES.Directional.type:
        return MODEL_TYPES.Directional.model();
      default:
        return MODEL_TYPES.Cube.model(config);
    }
  }
}

export default new modelFactory();
