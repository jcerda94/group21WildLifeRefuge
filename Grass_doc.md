# Purpose of GrassField.js

GrassField.js contains the controls for the Bluebunch Wheatgrass. It creates grass in random places. When a Snowshoe Hare eats the grass, it removes itself from the screen and then grows back some time later after it is eaten. The module uses a linked list when grass grows back. 

<!-- This is where you discuss why this file exists, how it works with the system, and what it is -->

# Functionality Overview

Function list:

| Function                             | Async? | Params           | Description                                                  |
| ------------------------------------ | ------ | ---------------- | ------------------------------------------------------------ |
| GrassField                           | Y      | config           | Loads the grasses onto the simulation board.                 |
| findRemoveIfNear (exported as a var) | N      | animalPos, range | Removes the grass the hare eats within a certain range.      |
| getDistance                          | N      | pos1, pos2       | Gets the distance from object to grass.                      |
| update                               | N      | none             | updates various attributes of the model                      |
| myGrasses                            | N      | none             | Returns the grass array so it can be searched for the nearby grass. |

<!-- Put in information about how the file or class works, if it has a complex flow, what it's doing over time in the simulation, etc -->

# Additional Complexity

ThreeJS is used to render the model for grass. A linked list is used in order to get the grass to grow back after it is eaten.  getSceneManager() from SceneManager.js is called to get the bounds of the ground to ensure grasses don’t show up off the board. Also, random from helpers.js allows the grass to be placed in a random spot on the board at launch or to be eaten in a random spot within the hare’s range.

<!-- Some files have additional behavior defined outside them that might need explaining, like how a tree gets thirsty -->

# Main Interaction Points

GrassField.js is used in the following classes:

- Hare.js
- ModelFactory.js

<!-- Focus on where this file / class is used, which will help isolate where to look if it breaks -->

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)