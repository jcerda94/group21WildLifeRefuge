# Purpose of TargetedGrassField.js
TargetedGrassField is a variant of GrassField.js that is used exclusively inside the EnvironmentManager class. The original GrassField class creates a certain number of randomly placed grass objects based on a `config` initialization object. The EnvironmentManager needs to be able to create potentially large numbers of grass objects with non-randomized locations. So instead of receiving a `{ grasses: count }` object to initialize the number of grass objects, TargetedGrassField is passed a `{ coords: targets }`
object. `targets` contains an array of `{x: newX, y: newY}` objects, each specifying the position of a new grass object.

# Functionality Overview

TarrgetedGrassField replaces the position randomization within GrassField and instead iterates
through an array of `{x: newX, y: newY}` objects to set the specific location of each new grass object.
Returns an array of new grass objects.

TargetedGrassField is for exclusive use within the EnvironmentManager. It is not currently configured for general use,
so it is not included in the ModelFactory class.

For general functionality see [GrassField.js](../../Grass_doc.md)

# Main Interaction Points

TargetedGrassField is tightly coupled to the current implementation of GrassField.js and to the way SceneManager.js adds objects to the Scene.
Any updates to GrassField will need to also be applied to this class.

TargetedGrassField is used by the [EnvironmentManager](EnvironmentManager.md).


[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)