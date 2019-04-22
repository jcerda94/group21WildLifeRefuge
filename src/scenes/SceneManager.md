# Purpose of SceneManager.js
SceneManager is central to the simulation and how it runs. It doesn't have any simulation logic in it, however,
it does manage the models drawn on screen. It's the primary and only means to add and remove models from the scene.

The SceneManager also runs the update loop and calls update on all the subjects in the scene. A subject can be missing an
update function and it will not crash, the subject may not need updating at all. Lighting is an example of something that doesn't
get updated during the render loop. 

The SceneManager also handles waiting to render the scene until both SmartSparrow and any external model files are done loading in. These operations take time so a simple scene with a sphere is shown until they're done. 

# Functionality Overview
The update() function runs once every animation frame, and it cycles through the models in `this.subject` and calls `update()` on each one.
Some models use the elapsed time and the simulation time to update their behavior, so this is passed to all models as arguments. This lets a model know how much time has elapsed so it can update its behavior accordingly. One example would be an update to how hungry a Hare is based on an hour elapsing since the last update call. 

There are multiple helper functions in SceneManager that are used throughout the application. These should be changed with caution and a solid understanding of how they're being consumed in other locations of the application.

# Additional Complexity
SceneManager is a singleton, but its constructor takes an argument. Since the argument needs to be provided at run time the SceneManager isn't actually available to be used until that its been constructed initially. So far this hasn't caused any problems but its just something to be aware of.


# Main Interaction Points
SceneManager touches almost every part of the application in some way or another. It is tightly coupled with the application.

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)