# Purpose of Tree.js

Trees are parts of our simulation models, and Trees play an important role in the simulation, since trees provide shelters for hawks and and hares alike. Alos, Trees make our simulation looks closer to reality, since wildlife refuge places mostly have trees. Thus, Tree.js allows users to add trees to the simulation, so that user would feel like they are experiencing as real as posible to actual wildlife refuge. In addition, hares and hawks would have place to rest and hide. 



# Functionality Overview

| Function            | Async? | Param                       | Description                                                  |
| ------------------- | ------ | --------------------------- | ------------------------------------------------------------ |
| update()            | N      | elapsedTime, simulationTime | can be use to update itself, and called from sceneManager about 60 frames per second |
| setLabelTo          | N      | object                      | To display thirsty label to indicate water consumption       |
| setTreeLayFlat    | N      | None                        | To lay tree flat on the ground to indicate that tree is dying |
| setTreeTo45Degree   | N      | None                        | To angle tree at 45 degree to indicate that tree is not healthy |
| setTreeToGreen      | N      | None                        | To set tree back to healthy level                            |
| upDateLabelPosition | N      | None                        | position thirsty label according new tree's position         |
| onDestroy           | N      | None                        | Remove thirsty label when tree is removed.                   |



# Additional Complexity

At update function, tree object is called constantly, so within update function, there are lot going on for the tree. For instance, tree is consuming water as it get updated. When water level at tree position is depleted, the tree will die and removed from the scene. Also, there function that add tree according current time interval, if there are two or more trees in the simulation. 

# Main Interaction Point

Tree.js is used at Hare.js. For instance, when a hare detect a hawk is close by, hare is searching for nearest tree for hiding place.

See Hare.js





