# Purpose of the GrassField.js file
GrassField.js contains the controls of the GrassField model. The GrassField object is creates a field of grass composed of individual grass objects. 

# Functionality Overview
 It provides awareness of nearing objects to determine the likelyhood of an animal consuming its grass object.  If the object that is nearing has a large enough eating range and the distance is short enough the GrassField will remove the individual object and update the simulation.

Function List:

|      Function Name      | Parameters           | Explanation                                                  |
| :---------------------: | -------------------- | ------------------------------------------------------------ |
|       GrassField        | config               | Default constructor for GrassField object                    |
|      myGrasses          | n/a                  | Returns Grasses objects                                      |
|     findRemoveIfNear    | animalPos, range     | Detects if an animal is near the grass and compares the distance to the animal's eating range.  If the distance is less than the eating range individual grasses are removed from the grass field  |
|     isGreaterThan       | n1, n2               | Helper function that returns the comparison of 2 numbers to determine which is greater |
|      getDistance        | pos1, pos2           | Returns the distance between pos1 and pos2.                  |


# Additional Complexity

The GrassField objects are created by the ModelFactory.js file

# Main Interaction Points

GrassField is managed by SceneManager and EnvironmentManager.

See:

- GrassField.js

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)