# Purpose of File / Class
ModelFactory is our way of managing the complexity of needing some JavaScript objects all over the place in the simulation. This file is essentially a pass through. It makes sure all the models created are created with roughly the same structure across the application. 

# Functionality Overview
To use ModelFactory you call the one function exposed: `ModelFactory.makeSceneObject(options)`. The `options` object has a `type` which corresponds to a models type. If it can't find the type you ask for, you get a cube. The `options` object can also take an optional config object. This is whats used to tell models how to do collision detection. Hawks and Hares both have collision detection so they know when they've hit another model. Collision detection is handled by `CollisionSphere.js`.

# Additional Complexity
Not all models currently take a config object. To set one up, just pass the config object to the corresponding model type, and on to the model types' constructor. Models are JavaScript closures but they are instantiated with the `new` keyword. 

# Main Interaction Points
Anywhere in the app that needs to create new models should be using this file to do so.

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)