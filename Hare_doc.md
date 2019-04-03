# Purpose of the Hare.js file
Hare.js contains the controls and actions of the Snowshoe hare model. It allows the hare to move using the Tween.js framework, eat nearby grass, and to check for and hide from predators. It also contains the ability to pause and review the hare’s movements.  TweenJS is a framework for animation, specifically “tweening.” By definition, tweening is the process of generating intermediate frames between two images to give the appearance such that the first image evolves smoothly into the second image. The Hare’s eating behavior can be found in GrassField.js. 

# Functionality Overview



Function List:

|      Function Name      | Parameters           | Explanation                                                  |
| :---------------------: | -------------------- | ------------------------------------------------------------ |
|       createTween       | n/a                  | Creates the ability for the hare to move around in the grass. |
|      checkForHawks      | hare, hawkPos, range | Checks if a hawk is near. If a hawk is near, the hare will hide under a tree. escapeFromHawk is called here. |
| closestDistanceFromHawk | n/a                  | Detects a hare the closest distance from a hawk.             |
|     escapeFromHawk      | hare                 | Detects whether a hawk is too close or not.                  |
|      hideFromHawk       | hare                 | Adds the ability for a hare to hide under a tree and wait for a hawk to fly away. |
|          pause          | n/a                  | Pauses the hare’s movements.                                 |
|         resume          | n/a                  | Resumes the hare’s movements if paused.                      |
|         update          | simulationTime       | Updates various attributes of the objects (hiding, hunger, etc). |
|     handleCollision     | n/a                  | Callback used to process the results of a collision.         |
|       setLabelTo        |                      | Sets the label to visible or invisible                       |
|        onDestroy        | n/a                  | When a hare gets eaten or dies, the hare will be removed from the simulation. |
|   updateLabelPosition   | n/a                  | Follows the position of an object and makes sure that updates its position when the object is hovered over. |
|       getDistance       | pos1, pos2           | Returns the distance between 2 points.                       |
|        getHareID        | theHare              | Returns the given ID of a hare.                              |



# Additional Complexity

The hare’s grass eating behavior is seen in Grassfield.js. When findRemoveIfNear is called, the hare eats random hares within a specified range. 

# Main Interaction Points

Hare.js is only used one other place in the project 

See:

- Hawk.js

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)