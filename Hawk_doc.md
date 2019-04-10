# Purpose of Hawk.js

Hawk.js contains controls for the Red-Tailed Hawk model. It includes attributes like gender, hunger, etc. The code uses CAPI in order to integrate with SmartSparrow. It also uses TweenJS to create the flying animation as well as the 3D graphic representing a hawk.

<!-- This is where you discuss why this file exists, how it works with the system, and what it is -->

# Functionality Overview

Function list:

| Function            | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| Hawk                | Initializes Hawk Object along with several attributes such as hunger, speed, gender. All controls are in this function as well. |
| breedingHandler     | Handles when a female Hawk gives birth to a baby hawk        |
| return2DPosition    | Projects a line from the model to the screen so that the label can be positioned with html absolute positioning |
| setLabelTo          | Sets Label to visible or invisible                           |
| onDestroy           | When a hawk dies, it is removed from the simulation.         |
| updateLabelPosition | Follows the position of an object and makes sure that updates its position when the object is hovered over. |
| update              | updates various attributes of the object (hunger, breeding, etc). |
| handleCollision     | Handles when a hawk grabs a hare and takes it away           |

<!-- Put in information about how the file or class works, if it has a complex flow, what it's doing over time in the simulation, etc -->

# Additional Complexity

getHawkObserver from observer.js implements the observer pattern on the hawk. The hare attaches a HawkObserver and receives broadcasts when a hawk moves. The hare then determines if  the hawk is a danger by determining it's distance. If so then the hare responds by finding the closest hiding spot and moving to it.

For example, The hare attaches to a HawkObserver in the watchAnimal call in Hare.js:

const hawkObserver = watchAnimal(getHawkObserver(), checkHawkDanger);

The objects that are attached to CAPI are genderBias and shouldShowLabel.

# Main Interaction Points

The var getHawks is used in Hare.js.

getHawkObserver is also called in Hare.js.

[Github Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)