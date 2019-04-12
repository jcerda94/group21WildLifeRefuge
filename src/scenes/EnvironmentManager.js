import {getSceneManager} from "./SceneManager";
import {getCapiInstance} from "../utils/CAPI/capi";

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
// Used to support Internet Explorer
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function(value) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError('this is null or not defined');
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
if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
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

    textureCanvas = null;
    sceneManager = null;
    localEnv = null;
    trackedObjects = [];
    //TODO Consider how to adapt for nutrients on weather type?
    //TODO Maybe create two separate tables or a nested set of ordered values similar to the consumeParams?
    weatherMod = 1.0;

    //CAUTION! consumeKey objects will only be shallow copied
    defaultEnvironment = {
        water: 1.0,
        waterRegen: 0.001,
        waterBalanceThreshold : 0.5,
        nutrients: 1.0,
        treeParams: [0.125, 0.125, 2.0],
        grassParams: [0.01, 0.01, 0.25],
        //TODO Document how the params are loaded into objects
        envConsumeKeys: ["water", "nutrients"],
        auxEnvParams: ["nutrientReturnOnDeath"],
        weatherTypes: ["Normal", "Rain", "Drought"],
        weatherModifiers: [1.0, 1.5, 0.5],
        weather: "Normal"
    };

    constructor(){

        this.initializeEnvironmentWithParams(this.defaultEnvironment);
        // Creates a THREE Texture using an HTML Canvas element
        var drawingCanvas = document.getElementById( 'drawing-canvas' );
        var drawingContext = drawingCanvas.getContext( '2d' );
        drawingContext.fillStyle = '#996600';
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


    initializeEnvironmentWithParams(environmentObject) {

        this.defaultEnvironment = environmentObject;

        this.updateWeatherModifier();

        //TODO: Explain object creation here
        //TODO: Explain that only consumables are loaded into every tile
        //Includes any parameters that we want in every environment tile,
        //other object values will simply be made available under the defaultEnvironment object
        const fillObject = environmentObject.envConsumeKeys.reduce(
            (o, key) => ({...o, [key]: environmentObject[key]}),
            {}
        );

        this.sceneManager = getSceneManager();

        //Added 1 to array size to handle odd ground sizes (1222 x 899) and objects at the absolute edge of the ground
        const groundX = Math.trunc(this.sceneManager.groundSize.x/10) + 1;
        const groundY = Math.trunc(this.sceneManager.groundSize.y/10) + 1;

        //Initializes an array shaped like our ground object, and fills it with a set of default environment conditions
        // CAUTION! Only does a shallow copy of the defaultEnvironment object
        //TODO: Add dynamically generated environments (non-uniform starting conditions, maybe toy environment 'painter')
        this.localEnv = [...Array(groundX)].map(
            ()=>Array(groundY).fill().map(
                () => Object.assign({}, fillObject)
            ));
    }

    updateWeatherModifier(){

        const capi = getCapiInstance();

        const newWeather = capi.capiModel.get('env.weather');
        const weatherIdx = this.defaultEnvironment.weatherTypes.findIndex(type => type === newWeather);

        this.weatherMod = this.defaultEnvironment.weatherModifiers[weatherIdx];
        this.defaultEnvironment.weather = newWeather;

    }

    getEnvByXYPos(x, y){

        const pos = this.groundXYToCanvasXY(x, y);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        return this.localEnv[envArrX][envArrY];

    }

    canvasXYToGroundXY(x, y){

        const xPos = x - (this.sceneManager.groundSize.x / 2);
        const yPos = y - (this.sceneManager.groundSize.y / 2);

        return {x: xPos, y: yPos}
    }

    groundXYToCanvasXY(x, y){

        const xPos = x + (this.sceneManager.groundSize.x / 2);
        const yPos = y + (this.sceneManager.groundSize.y / 2);

        return {x: xPos, y: yPos}

    }


    prettyPrintEnvStateToConsole() {

        let output = '';
        let cssStyling = [];

        for (var i = 0; i < this.localEnv.length; i++){
            for (var j = 0; j < this.localEnv[0].length; j++){
                output += '%c█';

                let colorLightness = 100 - (50 * this.localEnv[j][i].water);
                let cssString = 'color:hsl(204, 100%, ' + colorLightness + '%)';
                cssStyling.push(cssString);
            }
            output += '\n';
        }

        console.clear();
        console.warn("CAUTION: USE SPARINGLY, THIS CLEARS THE CONSOLE AND PUTS A SIGNIFICANT BURDEN ON THE CONSOLE WINDOW");
        console.log(output, ...cssStyling);

    }

    drawOnCanvas(x, y, color = '#5b7aff', convertXY = true) {

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
        if (this.sceneManager.ready){
            this.sceneManager.scene.children[3].material[2].map.needsUpdate = true;
        }

    }

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

    consume(object) {

        const pos = this.groundXYToCanvasXY(object.position.x, object.position.z);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        let neighbors = [this.localEnv[envArrX][envArrY]];

        if (object.type === 'Tree'){
            neighbors.push(...this.getAdjacentTiles(envArrX, envArrY));
        }

        for (var i=0; i < this.defaultEnvironment.envConsumeKeys.length; i++){

            let key = this.defaultEnvironment.envConsumeKeys[i];

            let valid = neighbors.filter(tile => tile[key] > 0);

            let balancedConsumption = object[key] / valid.length;
            for (var k=0; k < valid.length; k++){
                valid[k][key] -= balancedConsumption;
            }
        }

    }

    //TODO: Add germination stats/params
    //TODO: Add random grass/tree in radius by germination stats
    //TODO: Add hare/hawk nutrient replenishment upon death
    //TODO: Add raindrops on environment
    //TODO: Change ground tile darkness based on water saturation
    registerTrackedObject(envObject) {


        const objectKey = this.getObjectParamKeyFromType(envObject.type);
        const targetArrLength = this.defaultEnvironment.envConsumeKeys.length + this.defaultEnvironment.auxEnvParams.length;

        //Checks that a match was found and that the array of parameters has the same length as our consumption keys
        if (objectKey.length > 0 && this.defaultEnvironment[objectKey].length === targetArrLength){

            //Assigns consume key values from the object's capi Parameters. This assumes that the object parameters
            //and consume keys are in the same order.
            for (var i = 0; i < this.defaultEnvironment.envConsumeKeys.length; i++) {
                envObject[this.defaultEnvironment.envConsumeKeys[i]] = this.defaultEnvironment[objectKey][i];
            }

            //Assigns auxiliary key values from the object's capi Parameters. This assumes that the object parameters
            //and auxiliary keys are in the same order.
            for (var j = 0; j < this.defaultEnvironment.auxEnvParams.length; j++) {
                //We use i+j because all object params are in an ordered shared array. So by starting at i + 0 we start at
                //the first object parameter after the envConsume keys
                envObject[this.defaultEnvironment.auxEnvParams[j]] = this.defaultEnvironment[objectKey][i+j];
            }

            this.consume(envObject);

            this.trackedObjects.push(envObject);
        } else {
            console.warn("Object type: " + envObject.type + " is not currently supported by EnvironmentManger or\n" +
                "Object model parameters do not match environmentConsumeKeys length")
        }

    }

    getObjectParamKeyFromType(type){

        var findKey = Object.keys(this.defaultEnvironment).find(key => key.includes(type.toLowerCase()));

        return typeof findKey !== 'undefined' ? findKey : '';
    }

    onDeath(object){
        const pos = this.groundXYToCanvasXY(object.position.x, object.position.z);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        this.localEnv[envArrX][envArrY].nutrients += object.nutrientReturnOnDeath;
    }

    //TODO add function for nutrient addition that can be called in onDestroy

    //TODO: Absorb nutrients/water in a given radius (object.env object, radius)

    //Creates a Generator iterator. This will iterate through the entire environment array with each call.
    //Use: localEnvGenerator.next() returns an object similar to {value: nextVal, done: false}
    //Google javascript generators to understand the functionality/uses better
    *localEnvGenerator () {
        for (var i = 0; i < this.localEnv.length; i++) {
            for (var j = 0; j < this.localEnv[0].length; j++) {
                yield {env: this.localEnv[j][i], x: j, y: i};
            }
        }
    }

    async toggleEnvironmentViewOnCanvas() {

        for (var i = 0; i < this.localEnv.length; i++) {
            for (var j = 0; j < this.localEnv[0].length; j++) {
                let colorLightness = 100 - (50 * this.localEnv[j][i].nutrients);
                let titleColor = 'hsl(204, 100%, ' + colorLightness + '%)';

                this.drawOnCanvas(j * 10, i * 10, titleColor, false);
            }
        }

    }

    //TODO: Add documentation of approach/use of this function
    async balanceWaterTable() {

        const envGen = this.localEnvGenerator();
        let lowWater = [...envGen].filter(val => val.env.water < this.defaultEnvironment.waterBalanceThreshold);

        for (var i = 0; i < lowWater.length; i++) {

            //Will return valid adjacent env tiles
            let neighborsWithWater = this.getAdjacentTiles(lowWater[i].x, lowWater[i].y).filter(
                tile => tile.water > this.defaultEnvironment.waterBalanceThreshold);

            if (neighborsWithWater.length > 0) {
                //console.log("neighbor with water + " + neighborsWithWater.length);
                //TODO: Change name of waterRegen to reflect the value is actually how much water is being
                //TODO: redistributed to the center tile
                let waterBalanced = this.defaultEnvironment.waterRegen / neighborsWithWater.length;
                for (var j = 0; j < neighborsWithWater.length; j++) {
                    neighborsWithWater[j].water -= waterBalanced;
                }

                lowWater[i].water += this.weatherMod * this.defaultEnvironment.waterRegen;
            }

        }

    }

    //TODO: Update to support/enhance element behaviors
    update() {

        for (var i = 0; i < this.trackedObjects.length; i++) {
            this.consume(this.trackedObjects[i])
        }

        this.balanceWaterTable();

    }

    //TODO Consider performance tuning for final commits
    //TODO update with flip flop for water/nutrients

}

export const getEnvironmentManager = () => {
    return EnvironmentManager.instance || null;
};

export default function (container) {
    if (!EnvironmentManager.instance) {
        EnvironmentManager.instance = new EnvironmentManager(container);
    }
    return EnvironmentManager.instance;
}