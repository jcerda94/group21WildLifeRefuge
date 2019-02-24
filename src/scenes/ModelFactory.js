import TreeModel from "./Tree";
import HawkModel from "./Hawk";
import HareModel from "./Hare";
import BushModel from "./Bush";
import CubeModel from "./Cube";
import GroundModel from "./Ground";
import GrassField from "./GrassField";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import SpotLight from "./SpotLight";
import CollisionSphereModel from "./CollisionSphere";

const Hawk = config => {
  const { model, created, update } = HawkModel(config);
  if (config && config.useCollision) {
    console.log("using collision");
  }
  return {
    model,
    created,
    update
  };
};
const Hare = config => {
  const { model, created, update } = HareModel(config);
  return {
    model,
    created,
    update
  };
};
const Bush = config => {
  const { model, created, update } = BushModel(config);
  return {
    model,
    created,
    update
  };
};
const Tree = config => {
  const { model, created } = TreeModel(config);
  return {
    update: () => {},
    model,
    created
  };
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
const Ambient = config => {
  const { light, update } = AmbientLight(config);
  return {
    model: light,
    created: new Date(),
    update
  };
};
const Directional = config => {
  const { light, update } = DirectionalLight(config);
  return {
    model: light,
    created: new Date(),
    update
  };
};
const Spot = config => {
  const { light, update } = SpotLight(config);
  return {
    model: light,
    created: new Date(),
    update
  };
};
const CollisionSphere = ({ targets, handleCollision }) => {
  const { model, update, created } = CollisionSphereModel({
    targets,
    handleCollision
  });

  return { model, update, created };
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
  },
  CollisionSphere: {
    type: "collisionSphere",
    model: CollisionSphere
  }
};

class modelFactory {
  makeSceneObject (options) {
    const { type, config } = options;
    switch (type) {
      case MODEL_TYPES.Hawk.type:
        return MODEL_TYPES.Hawk.model(config);
      case MODEL_TYPES.Hare.type:
        return MODEL_TYPES.Hare.model(config);
      case MODEL_TYPES.Bush.type:
        return MODEL_TYPES.Bush.model(config);
      case MODEL_TYPES.Tree.type:
        return MODEL_TYPES.Tree.model(config);
      case MODEL_TYPES.Grass.type:
        return MODEL_TYPES.Grass.model(config);
      case MODEL_TYPES.Ground.type:
        return MODEL_TYPES.Ground.model(config);
      case MODEL_TYPES.Ambient.type:
        return MODEL_TYPES.Ambient.model(config);
      case MODEL_TYPES.Spot.type:
        return MODEL_TYPES.Spot.model(config);
      case MODEL_TYPES.Directional.type:
        return MODEL_TYPES.Directional.model(config);
      case MODEL_TYPES.CollisionSphere.type:
        return MODEL_TYPES.CollisionSphere.model(config);
      default:
        return MODEL_TYPES.Cube.model(config);
    }
  }
}

export default new modelFactory();
