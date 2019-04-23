# Purpose of the Bush.js file
Bush.js contains the controls and actions of the SageBush model. It allows the bush to be populated throughout the simulation.  

# Functionality Overview



Function List:

|      Function Name      | Parameters           | Explanation                                                  |
| :---------------------: | -------------------- | ------------------------------------------------------------ |
|       Bush                | n/a                   | Default constructor for SageBush model                    |
|      update               |                       | Currently empty and unimplemented                         |
|     onDestroy             | n/a                   | Called when the SceneManager removes the object from the scene. `getEnvironmentManager().onDeath(cube)` is called and informs the EnvironmentManager to remove the object from it's tracked objects.
|     getBushes             | n/a                   | Returns all the bush objects from the SceneManager        |



# Additional Complexity

Bush objects are added by the AddModels.js file and remvoed by the RemoveModels.js file.  Bush interaction with the simulation is managed by the SceneManager.

# Main Interaction Points

Bush.js is used in the AddModels, RemoveModels, PreloadModels, EnvironmentManager and SceneManager

See:

- Bush.js

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)