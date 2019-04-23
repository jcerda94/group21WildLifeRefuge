# Purpose of File / Class
The behavior.js file contains a good number of behaviors used by the Hawks and Hares. These include things like hunger, death, fleeing, moving to food, and having labels over their models. 

# Functionality Overview
All the functionality is outlined in JSDoc comments in the file. Most of the functions are straightforward implementations of their behaviors.

# Additional Complexity
The breeding behavior is probably the most difficult to understand, as its a series of events broadcast between two sets of models: males and females. The females broadcast an `ovulation` event to all males which are registered for that particular event. The males respond immediately by broadcasting their own event. If the female has not already bred with another male, it will respond to the male's event and run its breeding handler. 

# Main Interaction Points
This file touches most of the models on the screen, as they all depend on some variation of its behavior definitions. 

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)