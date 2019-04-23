# Purpose of the EnvironmentManager.js
EnvironmentManager creates a simulated ground environment that Plant and Animal objects can interact with. 


Some interactions that are modeled: 
- Water and nutrient consumption
- Plant germination
- Decaying organic matter returning nutrients to the environment
- Water flowing from high level areas to low level areas

# Functionality Overview:

The EnvironmentManager creates an 2D array of tiles that represents a low resolution version of the simulation ground.
These tiles are populated with properties declared in `envConsumeKeys` and set with matching values. As objects are registered
with the EnvironmentManager, they are populated with matching properties/values that set their rate of consumption for tile properties.
Based on these two operations, tile property initialization and object property initialization, many complex interactions are
mediated by the EnvironmentManager.
 
Class functions are directly annotated in `EnvironmentManager.js`. 

Class variables:

| Parameter           | Explanation                                                  |
|-------------------- | ------------------------------------------------------------ |
|   `textureCanvas`     | Stores a canvas element that we will use as a texture for the ground plane                   |
|   `sceneManager`      | Stores an instance of the SceneManager for easy use          |
|   `localEnv`         | Stores our initialized environment as a set of nested arrays |
|   `trackedObjects`   | Array to track objects that have been added to the EnvironmentManager |
|   `weatherMod`        | When the weather is updated, this value is updated to adjust germination and waterRegen rates |
|   `objectRemovalQueue`| Array to store objects that have been removed from the sim during the most recent update cycle |
|   `objectCreationQueue` | Array to store the position of grass objects that need to be created |
|   `envTime`           | Stores the time of the most recent update |
|   `tickTock`          | Used to alternate updates between water balancing and object consumption/germination |
|   `defaultEnvironment` | An object used to store all user set parameters. Contains default values. 

DefaultEnvironment Parameters:
- The DefaultEnvironment object will be overridden with any "env." prefixed values
from the capiModel.json file. It is presumed that all parameters below will be always be included.

| Parameter           | Type | Explanation   |
| :---------------------: | :--------------------: | :----: |
|  `water` | `Number` | Sets the initial water value for each Environment Tile. |
|  `waterRegen` | `Number`| Amount of water each tile below `waterBalanceThreshold` will regenerate each update. |
|  `waterFlow` | `Number` | Amount of water that will be rebalanced from valid neighboring tiles in `balanceWaterTable()`. |
|  `updateRate` | `Number` | The cadence at which `update()` will execute. This unit for the value is hours in Sim time. |
|  `objectLimit` | `Number` | Global limit for the number of objects that can be created by the Environment Manager. |
|  `waterBalanceThreshold` | `Number` | Determines which tiles receive water balancing. Tiles below the threshold will receive water and tiles above the threshold will lose water to neighboring low water tiles.  |
|  `nutrients` | `Number` | Sets the initial nutrient value for each Environment Tile. |
|  `treeParams` | `Array` | An array of values used to initialize Environment related properties for Tree objects. Values are in ordered sequence matching the order of keys in: `envConsumeKeys` -> `auxEnvParams`.  |
|  `grassParams` | `Array` | An array of values used to initialize Environment related properties for Grass objects. Values are in ordered sequence matching the order of keys in: `envConsumeKeys` -> `auxEnvParams` .  |
|  `bushParams` | `Array` | An array of values used to initialize Environment related properties for Bush objects. Values are in ordered sequence matching the order of keys in: `envConsumeKeys` -> `auxEnvParams`.   |
|  `numAnimalParams` | `Number` | The number of parameters in `auxEnvParams` that will apply to animal type objects. |
|  `hareParams` | `Array` | An array of values used to initialize Environment related properties for Hare objects. Values are in ordered sequence matching the order of keys in `auxEnvParams` starting from the `numAnimalParams`th position from the end of the `auxEnvParams` array. |
|  `hawkParams` | `Array` | An array of values used to initialize Environment related properties for Hawk objects. Values are in ordered sequence matching the order of keys in `auxEnvParams` starting from the `numAnimalParams`th position from the end of the `auxEnvParams` array. |
|  `envConsumeKeys` | `Array` | An array of keys that are used to set the properties of each environment tile and the properties on each tracked object for consuming environment resources. |
|  `auxEnvParams` | `Array` | An array of keys used to set common object properties related to the Environment Manager. |
|  `weatherTypes` | `Array` | An array of named weather types. These types are matched in sequence with the weather modifiers below. |
|  `weatherModifiers` | `Array` | An array of values that correspond to different name weather types. |
|  `weather` | `String` | The currently selected weather type. |

# Additional Complexity

The canvas used on the ground plane is initialized in the EnvironmentManager before being attached to a THREE.js mesh material in [Ground.js](./Ground.js). Afterwards the Canvas can't be updated until the SceneManager is fully initialized. The variable `SceneManager.ready` is a boolean value
that indicates when the SceneManager is ready to process texture updates for the Canvas.

# Main Interaction Points

   The EnvironmentManager touches every Simulation object and extensively interacts with the SceneManager. 
   
   Objects are primarily effected through `registerTracedObject(object)` and `onDeath()` called in their `onDestroy()` function.
   
   SceneManager is tightly coupled. Any changes to the initialization of the SceneManager may effect how the ground canvas element
   is attached to the ground plane and initialized in the EnvironmentManager. See: [Ground.js](./Ground.js) and [StudentView](../components/StudentView.js) (contains the ground canvas element).

Interaction Points:
- [capi](../utils/CAPI/capi.js)
- [SceneManger.js](./SceneManager.md)
- [Bush](../../Bush_doc.md)
- [Tree](../../Tree_Doc.md)
- [GrassField](../../Grass_doc.md)
- [TargetedGrassField](TargetedGrassField.md)
- [Hawk](../../Hawk_doc.md)
- [Hare](../../Hare_doc.md)


[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)