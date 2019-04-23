import {getSceneManager} from "./SceneManager";
import {getCapiInstance} from "../utils/CAPI/capi";
import {random} from "../utils/helpers";
import ModelFactory from "./ModelFactory";
import TargetedGrassField from "./TargetedGrassField";

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
// Used to support Internet Explorer
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, "fill", {
        value: function(value) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError("this is null or not defined");
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        }
    });
}

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
// Used to support Internet Explorer and Android Webviews
if (typeof Object.assign != "function") {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            if (target == null) { // TypeError if undefined or null
                throw new TypeError("Cannot convert undefined or null to object");
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

class EnvironmentManager {

    //Stores a canvas element that we will use as a texture for the ground plane
    textureCanvas = null;
    sceneManager = null;
    //Stores our initialized environment as a set of nested arrays
    localEnv = null;
    //Array to track objects that have been added to the EnvironmentManager
    trackedObjects = [];
    //When the weather is updated, this value is updated to adjust germination and waterRegen rates
    weatherMod = 1.0;
    //Array to store objects that have been removed from the sim during the most recent update cycle
    objectRemovalQueue = [];
    //Array to store the position of grass objects that need to be created
    objectCreationQueue = [];
    //Stores the time of the most recent update
    envTime = 0;
    //Used to alternate updates between water balancing and object consumption/germination
    tickTock = true;

    defaultEnvironment = {
        water: 1.0,
        waterRegen: 0.001,
        waterFlow: 0.1,
        updateRate: 1,
        objectLimit: 1500,
        waterBalanceThreshold : 0.5,
        nutrients: 1.0,
        treeParams: [0.125, 0.05, 0.01, 2.0],
        grassParams: [0.01, 0.01, 0.01, 0.25],
        bushParams: [0.025, 0.025, 0.01, 1.0],
        numAnimalParams: 1,
        hareParams: [1.0],
        hawkParams: [1.0],
        envConsumeKeys: ["water", "nutrients"],
        auxEnvParams: ["germinationRate", "nutrientReturnOnDeath"],
        weatherTypes: ["Normal", "Rain", "Drought"],
        weatherModifiers: [1.0, 1.5, 0.5],
        weather: "Normal"
    };

    /**
     * Initializes the EnvironmentManager.
     * Loads our default environment parameters into the localEnv array.
     * Connects the EnvironmentManager to the ground plane canvas and fills it in with a soil color
     */
    constructor(){

        this.sceneManager = getSceneManager();
        this.initializeEnvironmentWithParams(this.defaultEnvironment);
        // Creates a THREE Texture using an HTML Canvas element
        var drawingCanvas = document.getElementById( "drawing-canvas" );
        var drawingContext = drawingCanvas.getContext( "2d" );
        drawingContext.fillStyle = "#996600";
        drawingContext.fillRect( 0, 0, this.sceneManager.groundSize.x, this.sceneManager.groundSize.y);

        this.textureCanvas = drawingCanvas;
        this.drawingContext = drawingContext;

        const capi = getCapiInstance();

        capi.getCapiAdapter().expose('env.weather', capi.capiModel,
            {allowedValues: capi.capiModel.get('env.weatherTypes')});

        capi.addListenerFor({
            key: "env.weather",
            callback: () => {
                this.updateWeatherModifier();
            }
        })

    }

    /**
     * This takes an object formatted for the EnvironmentManager, extracts the types of parameters each tile in the
     * Environment should and assigns them to a fill object. That object is used to fill an array shaped like the
     * SceneManager ground size divided into 10x10 tiles.
     *
     * The fill object will assign the values that match the keys in the envConsumeKeys array to each tile in the Environment
     *
     * @param {environmentObject} environmentObject The object used to initialize the EnvironmentManager's parameters.
     * This is usually the set of values prefixed by "env" in the capiModel.json file.
     */
    initializeEnvironmentWithParams(environmentObject) {

        this.defaultEnvironment = environmentObject;

        this.updateWeatherModifier();

        //Includes any parameters that we want in every environment tile,
        //other object values/parameters will simply be made available under the defaultEnvironment object
        const fillObject = environmentObject.envConsumeKeys.reduce(
            (o, key) => ({...o, [key]: environmentObject[key]}),
            {}
        );

        //Added 1 to array size to handle odd ground sizes (1222 x 899) and objects at the absolute edge of the ground
        const groundX = Math.trunc(this.sceneManager.groundSize.x/10) + 1;
        const groundY = Math.trunc(this.sceneManager.groundSize.y/10) + 1;

        //Initializes an array shaped like our ground object, and fills it with a set of default environment conditions
        // CAUTION! Only performs a shallow copy of the supplied object
        this.localEnv = [...Array(groundX)].map(
            ()=>Array(groundY).fill().map(
                () => Object.assign({}, fillObject)
            ));
    }

    /**
     * This function is called by a listener on the "env.weather" value in Capi. It gets the new Weather type and
     * matches that type to it's index in the weatherTypes array. The weatherModifiers array values are ordered in the
     * same sequence as their matching types, so the previously found index is used to get the appropriate numerical
     * weather modifier and that value is used to update this.weatherMod
     */
    updateWeatherModifier(){

        const capi = getCapiInstance();

        const newWeather = capi.capiModel.get('env.weather');
        const weatherIdx = this.defaultEnvironment.weatherTypes.findIndex(type => type === newWeather);

        this.weatherMod = this.defaultEnvironment.weatherModifiers[weatherIdx];
        this.defaultEnvironment.weather = newWeather;

    }

    /**
     * Takes an SceneObject's x,y position and returns the appropriate tile from localEnv
     *
     * @param {Number} x
     * @param {Number} y
     */
    getEnvByXYPos(x, y){

        const pos = this.groundXYToCanvasXY(x, y);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        return this.localEnv[envArrX][envArrY];

    }

    /**
     * Takes an x,y coordinate from the ground plane's canvas and translates it to a THREE x,z position
     *
     * @param {Number} x
     * @param {Number} y
     */
    canvasXYToGroundXY(x, y){

        const xPos = x - (this.sceneManager.groundSize.x / 2);
        const yPos = y - (this.sceneManager.groundSize.y / 2);

        return {x: xPos, y: yPos};
    }

    /**
     * Takes an THREE x,z position and translates it to x,y coordinates on the ground plane's canvas
     *
     * @param {Number} x
     * @param {Number} y
     */
    groundXYToCanvasXY(x, y){

        const xPos = x + (this.sceneManager.groundSize.x / 2);
        const yPos = y + (this.sceneManager.groundSize.y / 2);

        return {x: xPos, y: yPos};

    }

    /**
     * Will print out a colored graphical representation of any environment tile value to the console
     * (usually an envConsumeKey value)
     *
     * Currently displays a blue colored gradient. This can be adjusted in the cssString variable (which accepts a css
     * formatted color as a string)
     *
     * @param {String} envParam The name of the value we want to map/display in the console
     */
    prettyPrintEnvStateToConsole(envParam) {

        let output = "";
        let cssStyling = [];

        for (var i = 0; i < this.localEnv.length; i++){
            for (var j = 0; j < this.localEnv[0].length; j++){
                output += "%c█";

                let colorLightness = 100 - (50 * this.localEnv[j][i][envParam]);
                let cssString = "color:hsl(204, 100%, " + colorLightness + "%)";
                cssStyling.push(cssString);
            }
            output += "\n";
        }

        console.clear();
        console.warn("CAUTION: USE SPARINGLY, THIS CLEARS THE CONSOLE AND PUTS A SIGNIFICANT"
                    + " BURDEN ON THE CONSOLE WINDOW");
        console.log(output, ...cssStyling);

    }

    /**
     * Given a coordinate and a color it will draw a square of that color on the ground plane canvas centered on
     * the given coordinates.
     *
     * @param {Number} x
     * @param {Number} y
     * @param {String} color A Hex value for the desired color, blue is the default
     * @param {Boolean} convertXY Boolean value that tells us if we need to convert from THREE object coordinates to
     * canvas coordinates, default is true
     */
    drawOnCanvas(x, y, color = "#5b7aff", convertXY = true) {

        // If no value is passed for convertXY this assumes that you are giving it ground XY coordinates
        // that are centered on the object. This converts the xy to canvas coordinates and shifts the drawn
        // square so it will end up centered on the object
        let canvasPos = {x: x, y: y};
        if (convertXY){
            x -= 5;
            y -= 5;
            canvasPos = this.groundXYToCanvasXY(x, y);
        }

        const xPos = canvasPos.x;
        const yPos = canvasPos.y;

        this.drawingContext.fillStyle = color;

        this.drawingContext.fillRect(xPos, yPos, 10, 10 );

        //The canvas will only be updated (drawn on) if the SceneManager is fully initialized
        if (this.sceneManager.ready){
            this.sceneManager.scene.children[3].material[2].map.needsUpdate = true;
        }

    }

    /**
     * Given the x and y indices of a Environment tile, an array of the surrounding tiles will be returned
     *
     * @param {Number} envArrX
     * @param {Number} envArrY
     * @returns {Array} An array of all Neighboring tiles
     */
    getAdjacentTiles(envArrX, envArrY) {

        let neighbors = [];

        const adjacencyMatrix = [[1,1], [0,1], [1,0], [-1,0], [0, -1], [-1,-1], [1,-1], [-1, 1]];

        const yBnd = this.localEnv.length;
        const xBnd = this.localEnv[0].length;


        for (var i = 0; i < adjacencyMatrix.length; i++) {
            let x = envArrX + adjacencyMatrix[i][0];
            let y = envArrY + adjacencyMatrix[i][1];

            if (((-1 < x && x < xBnd) && (-1 < y && y < yBnd))) {
                neighbors.push(this.localEnv[x][y]);
            }
        }

        return neighbors;
    }

    /**
     * Given a SceneObject, the envConsumeKey values of the object will be subtracted from the matching value in
     * environment tile beneath the object.
     *
     * @param {SceneObject} object
     */
    consume(object) {

        const pos = this.groundXYToCanvasXY(object.position.x, object.position.z);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        var neighbors = [];
        var groundTile = this.localEnv[envArrX][envArrY];

        if (object.type === 'Tree'){
            neighbors.push(...this.getAdjacentTiles(envArrX, envArrY));
        }

        for (var i=0; i < this.defaultEnvironment.envConsumeKeys.length; i++){

            let key = this.defaultEnvironment.envConsumeKeys[i];

            groundTile[key] -= object[key];

            if (neighbors.length > 0){
                let valid = neighbors.filter(tile => tile[key] >= 0);

                let balancedConsumption = object[key] / valid.length;
                for (var k=0; k < valid.length; k++){
                    valid[k][key] -= balancedConsumption;
                }
            }

        }

    }

    /**
     * Given a SceneObject this function will generate a new SceneObject of the same type and place it in
     * a random valid position near the existing object.
     *
     * @param {SceneObject} object
     */
    async createNearbyObject(object) {
        //Will only create a new object if the global object limit has not been reached
        if (this.trackedObjects.length < this.defaultEnvironment.objectLimit){

            //Generates a random position in +/- 50 units of the original object
            var newX = object.position.x + (random(-50, 50));
            var newY = object.position.z + (random(-50, 50));

            //It's validated that the new random position is within the bounds of the Simulation's ground plane
            if (newX > 0){
                newX = Math.min(newX, (this.sceneManager.groundSize.x / 2) - 15);
            } else {
                newX = Math.max(newX, -(this.sceneManager.groundSize.x / 2) + 15);
            }

            if (newY > 0){
                newY = Math.min(newY, (this.sceneManager.groundSize.y / 2) - 15);
            } else {
                newY = Math.max(newY, -(this.sceneManager.groundSize.y / 2) + 15);
            }

            //Uses the model factory to create a new SceneObject. If a new grass type object needs to be created,
            //it's coordinates are queued for batched grass creation.
            var newObject = null;
            switch (object.type) {
                case 'Tree':
                    newObject = ModelFactory.makeSceneObject({type: "tree" });
                    break;
                case 'Grass':
                    this.objectCreationQueue.push({x: newX, y: newY});
                    break;
                case 'Bush':
                    newObject = ModelFactory.makeSceneObject({ type: "bush" });
                    break;
                default:
                    //If there is no preset case, it will use whatever is returned from the ModelFactory
                    newObject = ModelFactory.makeSceneObject({ type: object.type });
                    break;
            }

            //Will add the object to the Scene if it is an object type supported by this function. Unknown object types
            // are returned as cubes from the ModelFactory
            if (newObject !== null){
                newObject.model.position.x = newX;
                newObject.model.position.z = newY;
                this.sceneManager.addObject(newObject);
            }
        }

    }

    /**
     * This function increases the Germination parameter of the supplied object based on the Environment's Weather value.
     * If the parameter rises above 1.0, a new object of the same type is added randomly nearby. If the object fails the
     * this.checkIfLiving(object) test, it's removed from the Scene and Environment Manager
     *
     * @param {SceneObject} object
     */
    germinate(object) {
        //Checks if nutrients/water are high enough
        if (this.checkIfLiving(object)){

            if (object.germinationLevel >= 1.0){
                this.createNearbyObject(object);
                object.germinationLevel = 0;

            } else {
                //this makes it so that when it's sunnier, they will photosynthesize faster
                object.germinationLevel += (2 - this.weatherMod) * object.germinationRate
            }

        } else {
            this.sceneManager.removeObject(object);
        }
    }

    /**
     * Checks envConsumeKey values in the environment tile at the given object's position.
     * Returns true if all envConsumeKey based values are above zero in the tile.
     *
     * @param {SceneObject} object
     * @returns {boolean}
     */
    checkIfLiving(object) {
        const envAtObj = this.getEnvByXYPos(object.position.x, object.position.z);

        return this.defaultEnvironment.envConsumeKeys.every(key => envAtObj[key] >= 0);
    }

    /**
     * Helper function that generates a random number within a +/- percent range of the original value
     *
     * @param val The original value
     * @param percentOffset The desired percent variance from the original value
     * @returns {Number}
     */
    static getRandomByPercent(val, percentOffset){
        const offset = val * (percentOffset/100);

        return random(val - offset, val + offset);
    }


    /**
     * This takes an SceneObject, assigns the appropriate properties based on the object type, and registers that object
     * with the EnvironmentManager by adding it to the trackedObjects class array
     *
     * Plant type objects are assigned all properties in envConsumeKeys and auxEnvParams
     * Animal type objects are assigned only certain properties from auxEnvParams based on the defaultEnvironment.numAnimalParams value.
     * numAnimalParams specifies the number of properties to be assigned to animal type objects starting from the last position of
     * auxEnvParams.
     *
     * Objects are matched to their property values based on the object type. It is presumed that within the defaultEnvironment object
     * there is a array called "{objectType}params" that has the object type in it's key. These values are assigned to the objects
     * only if the number of values for the object type matches the number of keys in envConsumeKeys and/or auxEnvParams
     * respectively. The values in the object type's array are assumed to be ordered in the same sequence as
     * [envConsumeKeys] -> [auxEnvParams] and will be assigned in that order.
     *
     * All properties are initialized with a 20 percent variance from the set value so that objects have some variance
     * (objects created at the same time will no longer update at the same time). This can be adjusted in the calls
     * to getRandomPercent below.
     *
     * After plant objects are assigned all relevant properties they are added to the trackedObjects array.
     *
     * @param {SceneObject} envObject
     */
    registerTrackedObject(envObject) {


        const objectKey = this.getObjectParamKeyFromType(envObject.type);
        const targetArrLength = this.defaultEnvironment.envConsumeKeys.length + this.defaultEnvironment.auxEnvParams.length;

        //Checks that a match was found and that the array of parameters has the same length as our consumption keys
        //This section is for plant objects
        if (objectKey.length > 0 && this.defaultEnvironment[objectKey].length === targetArrLength){

            //Assigns consume key values from the object's capi Parameters. This assumes that the object parameters
            //and consume keys are in the same order.
            for (var i = 0; i < this.defaultEnvironment.envConsumeKeys.length; i++) {
                envObject[this.defaultEnvironment.envConsumeKeys[i]] = EnvironmentManager.getRandomByPercent(this.defaultEnvironment[objectKey][i], 20);
            }

            //Assigns auxiliary key values from the object's capi Parameters. This assumes that the object parameters
            //and auxiliary keys are in the same order.
            for (var j = 0; j < this.defaultEnvironment.auxEnvParams.length; j++) {
                //We use i+j because all object params are in an ordered shared array. So by starting at i + 0 we start at
                //the first object parameter after the envConsume keys
                envObject[this.defaultEnvironment.auxEnvParams[j]] = EnvironmentManager.getRandomByPercent(this.defaultEnvironment[objectKey][i+j], 20);
            }

            //Adds a property to track the object's germination level
            envObject["germinationLevel"] = 0.0;

            this.trackedObjects.push(envObject);

          //This next section is for animal environmental properties
        } else if (objectKey.length > 0 && this.defaultEnvironment[objectKey].length === this.defaultEnvironment.numAnimalParams) {

            const endOfAuxArr = this.defaultEnvironment.auxEnvParams.length - 1;

            for (var k = 0; k < this.defaultEnvironment.numAnimalParams; k++){
                envObject[this.defaultEnvironment.auxEnvParams[endOfAuxArr-k]] = EnvironmentManager.getRandomByPercent(this.defaultEnvironment[objectKey][k], 20);
            }

            //Animals are specifically not pushed into the tracked object array because they only have behaviors on death

        } else {
            console.warn("Object type: " + envObject.type + " is not currently supported by EnvironmentManger or\n" +
                "Object model parameters do not match environmentConsumeKeys length")
        }

    }

    /**
     * Returns the first key from this.defaultEnvironment that includes a given object type
     *
     * @param {String} type
     * @returns {string}
     */
    getObjectParamKeyFromType(type){
        var findKey = Object.keys(this.defaultEnvironment).find(key => key.includes(type.toLowerCase()));

        return typeof findKey !== 'undefined' ? findKey : '';
    }

    /**
     * Called in the onDestroy function of each object. The object's nutrientOnDeath value is added to the environment tile
     * the object was located on at death. If the object has envConsumeKey properties, it is queued to be removed from the
     * trackedObjects array
     *
     * @param {SceneObject} object
     */
    onDeath(object){
        const pos = this.groundXYToCanvasXY(object.position.x, object.position.z);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        var tilesForReturn = [this.localEnv[envArrX][envArrY]];
        tilesForReturn.push(...this.getAdjacentTiles(envArrX, envArrY));

        tilesForReturn.forEach(tile => {
        tile.nutrients += object.nutrientReturnOnDeath;
        });

        //If the object is registered as a tracked object (all tracked objects have envConsumeKey properties)
        //then the object will be removed from the tracked object array
        if (object.hasOwnProperty(this.defaultEnvironment.envConsumeKeys[0])){
                this.objectRemovalQueue.push(object.uuid);
        }

    }

    /**
     * Creates a Generator iterator. This will iterate through the entire environment array with each call.
     * Each call to localEnvGenerator.next() returns an object similar to {value: nextVal, done: false}.
     * nextVal will contain an object of type {
     *      x: x index of the specified environment tile,
     *      y: y index of the specified environment tile,
     *      env: The tile object located at the above indices
     *  }
     *
     * @returns {IterableIterator<{x: number, y: number, env: *}>}
     */
    *localEnvGenerator () {
        for (var i = 0; i < this.localEnv.length; i++) {
            for (var j = 0; j < this.localEnv[0].length; j++) {
                yield {env: this.localEnv[j][i], x: j, y: i};
            }
        }
    }

    /**
     * Given the key of an environment tile property, this displays a heatmap of that property on the ground plane canvas.
     * Note: Currently the heatmap is displayed in a gradient from blue to white. This can be adjusted by supplying a
     * different HSL value in titleColor below
     *
     * @param {String} param A key from envConsumeKeys
     */
    async toggleEnvironmentViewOnCanvasByParam(param) {

        for (var i = 0; i < this.localEnv.length; i++) {
            for (var j = 0; j < this.localEnv[0].length; j++) {
                let colorLightness = 100 - (50 * this.localEnv[j][i][param]);
                let titleColor = "hsl(204, 100%, " + colorLightness + "%)";
                this.drawOnCanvas(j * 10, i * 10, titleColor, false);
            }
        }

    }

    /**
     * Iterates through all environment tiles that have a water value less than this.defaultEnvironment.waterBalanceThreshold
     * and redistributes water to that tile from neighboring tiles that have a value above this.defaultEnvironment.waterBalanceThreshold
     *
     * All tiles below this.defaultEnvironment.waterBalanceThreshold also regenerate a certain amount of water based
     * on the current weather modifier and the this.defaultEnvironment.waterRegen parameter
     */
    async balanceWaterTable() {

        //Uses a generator that supplies and iterator over all environment tiles, and filters the result for tiles that
        //have a water value below a certain threshold
        const envGen = this.localEnvGenerator();
        let lowWater = [...envGen].filter(val => val.env.water < this.defaultEnvironment.waterBalanceThreshold);

        for (var i = 0; i < lowWater.length; i++) {

            //Will return valid adjacent env tiles
            let neighborsWithWater = this.getAdjacentTiles(lowWater[i].x, lowWater[i].y).filter(
                tile => tile.water > this.defaultEnvironment.waterBalanceThreshold);

            if (neighborsWithWater.length > 0) {
                let waterBalanced = this.defaultEnvironment.waterFlow / neighborsWithWater.length;
                for (var j = 0; j < neighborsWithWater.length; j++) {
                    neighborsWithWater[j].water -= waterBalanced;
                }

                lowWater[i].env.water += this.defaultEnvironment.waterFlow + (this.weatherMod * this.defaultEnvironment.waterRegen);
            }

        }

    }

    /**
     *  Updates the Environment at a set cadence (this.defaultEnvironment.updateRate)
     *  Balances the water table and calls consume/germinate for each tracked object. Any objects that died between updates
     *  are removed at this point and queued grass objects are created.
     */
    async update() {
        const simTime = this.sceneManager.getElapsedSimTime({ unit: "minutes" });

        //The update rate is tied to "hours" in simulation,
        //Update is called twice in the update rate period. Once for object consumption/germination
        //and again for balancing the water table. Each type of environment update will update at the
        //cadence set in this.defaultEnvironment.updateRate
        if( (simTime - this.envTime) > this.defaultEnvironment.updateRate * 30){

            //Removes objects that died during the last cycle
            for (var j = 0; j < this.objectRemovalQueue.length; j++){
                this.trackedObjects = this.trackedObjects.filter(obj => {
                    return obj.uuid !== this.objectRemovalQueue[j];
                })
            }

            this.objectRemovalQueue = [];

            //Use to alternate between water balancing and consumption/germination each cycle
            if (this.tickTock){
                for (var i = 0; i < this.trackedObjects.length; i++) {
                    this.consume(this.trackedObjects[i]);
                    this.germinate(this.trackedObjects[i]);
                }

                this.tickTock = false;
            } else {
                this.balanceWaterTable();
                this.tickTock = true;
            }

            this.envTime = simTime;

            //Only for grass right now
            //Supports the efficient creation of a large number of grass objects
            if (this.objectCreationQueue.length > 0){

                //If there are a significant amount of grass objects queued for creation, 50 grass objects will be
                //generated in this update cycle and any remaining objects will be generate in future updates
                if (this.objectCreationQueue.length > 50){
                    const tempQueue = this.objectCreationQueue.slice(0, 50);

                    const targetGrassField = await TargetedGrassField({
                        coords: tempQueue
                    });

                    for (var k = 0; k < targetGrassField.length; k++){
                        this.sceneManager.addObject(targetGrassField[k]);
                    }

                    this.objectCreationQueue = this.objectCreationQueue.slice(50);

                } else {
                    const targetGrassField = await TargetedGrassField({
                        coords: this.objectCreationQueue
                    });

                    for (var k = 0; k < targetGrassField.length; k++){
                        this.sceneManager.addObject(targetGrassField[k]);
                    }

                    this.objectCreationQueue = [];
                }

            }
        }

    }

}

export const getEnvironmentManager = () => {
    return EnvironmentManager.instance || null;
};

//Ensures that an instance of EnvironmentManager is available for any call to getEnvironmentManager.
export default function (container) {
    if (!EnvironmentManager.instance) {
        EnvironmentManager.instance = new EnvironmentManager(container);
    }
    return EnvironmentManager.instance;
}