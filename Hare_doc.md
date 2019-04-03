# Purpose of the Hare.js file
Hare.js contains the controls and actions of the Snowshoe hare model. It allows the hare to move using the Tween.js framework, eat nearby grass, and to check for and hide from predators. It also contains the ability to pause and review the hare’s movements.  TweenJS is a framework for animation, specifically “tweening.” By definition, tweening is the process of generating intermediate frames between two images to give the appearance such that the first image evolves smoothly into the second image.
<!-- This is where you discuss why this file exists, how it works with the system, and what it is -->

# Functionality Overview

Function List:

|      Function Name      | Parameters           | Explanation                                                  |
| :---------------------: | -------------------- | ------------------------------------------------------------ |
|       createTween       | n/a                  | Creates the ability for the hare to move around in the grass. |
|      checkForHawks      | hare, hawkPos, range | Checks if a hawk is near. If a hawk is near, the hare will hide under a tree. escapeFromHawk is called here. |
| closestDistanceFromHawk | n/a                  | Detects a hare the closest distance from a hawk.             |
|     escapeFromHawk      | hare                 | Detects whether a hawk is too close or not.                  |
|      hideFromHawk       | hare                 | adds the ability for a hare to hide under a tree and wait for a hawk to fly away. |
|          pause          | n/a                  | pauses the hare’s movements.                                 |
|         resume          | n/a                  | resumes the hare’s movements if paused.                      |
|         update          | simulationTime       |                                                              |
|     handleCollision     | n/a                  |                                                              |
|       setLabelTo        |                      |                                                              |
|        onDestroy        | n/a                  | When a hare gets eaten or dies, the hare will be removed from the simulation. |
|   updateLabelPosition   | n/a                  |                                                              |
|       getDistance       | pos1, pos2           | returns the distance between 2 points.                       |
|        getHareID        | theHare              | returns the given ID of a hare.                              |



<!-- Put in information about how the file or class works, if it has a complex flow, what it's doing over time in the simulation, etc -->

# Additional Complexity

<!-- Some files have additional behavior defined outside them that might need explaining, like how a tree gets thirsty -->

# Main Interaction Points

<!-- Focus on where this file / class is used, which will help isolate where to look if it breaks -->

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)