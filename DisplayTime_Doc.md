# Purpose of DisplayTime.js

DisplayTime.js is an user interface for display simulation concept time. it displays days, weeks, and months, so that users can observe time and see changing behaviors of simulation as time goes by. Also, it can be use for debugging for models' behaviors. For instance, if set tree to grow every two days, developers could observe days on the UI and see if the tree is germinating. 

# Functionality

| Function          | Async? | Params               | Description                     |
| ----------------- | ------ | -------------------- | ------------------------------- |
| setSimulationTime | N      | elapsedTime, simTime | Set concept time for simulation |
| getDay            | n      | n                    | Return number of days           |
| getWeek           | n      | n                    | Return number of weeks          |
| getMonth          | n      | n                    | Return number of months         |



# Additional Complexity

DisplayTime.js receives elapsedTime and simTim from SceneManager; it could be used to display  simulation time or elapsed time concept.

# Main Interaction Point

DisplayTime.js displays time on main screen; it displays days, weeks, and months; thus, it is used by users who want to keep to know how long they have interact with the simulation.
