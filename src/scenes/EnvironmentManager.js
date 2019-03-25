import {getSceneManager} from "./SceneManager";

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

    //CAUTION! Object will only be shallow copied
    defaultEnvironment = {
        water: 1.0,
        treeThirst: 0.025,
        grassThirst: 0.01,
        waterRegen: 0.001,
        waterBalanceThreshold : 0.5,
        nutrients: 1.0,
        envConsumeKeys: ['water', 'nutrients']
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

    }

    initializeEnvironmentWithParams(environmentObject) {

        this.defaultEnvironment = environmentObject;

        

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



    consume(object) {

        const pos = this.groundXYToCanvasXY(object.position.x, object.position.z);

        const envArrX = Math.trunc(pos.x/10);
        const envArrY = Math.trunc(pos.y/10);

        let neighbors = [this.localEnv(envArrX, envArrY)];

        if (object.type === 'Tree'){

        }

        for (var i=0; i < this.defaultEnvironment.envConsumeKeys.length; i++){

        }

    }

    //TODO: Add dynamic updating of the tree/grass thirstyness, add a listener on the appropriate values
    //TODO: Add nutrient values to CAPI/SPR
    //TODO: Add nutrientParams and env params by type
    //TODO: Add germination stats/params
    //TODO: Add random grass/tree in radius by germination stats
    //TODO: Add hare/hawk nutrient replenishment upon death
    //TODO: Tree water radius
    //TODO: Add raindrops on environment
    //TODO: Change ground tile darkness based on water saturation
    registerTrackedObject(object) {

        //TODO: Add object type for bushes
        //TODO: Add nutrients
        switch (object.type) {
            case "Tree":
                object.water = this.defaultEnvironment.treeThirst;
                //object.nutrients = this.defaultEnvironment.treeNutrients;
                break;
            case "Grass":
                object.water = this.defaultEnvironment.grassThirst;
                break;
            default:
                console.warn("Object type: " + object.type + " not currently supported by EnvironmentManger")
        }

        //TODO: Break out into separate function
        let envTile = this.getEnvByXYPos(object.position.x, object.position.z);
        envTile.water -= object.water;

        this.trackedObjects.push(object);
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
                let colorLightness = 100 - (50 * this.localEnv[j][i].water);
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

                lowWater[i].water += this.defaultEnvironment.waterRegen;
            }

        }

    }

    //TODO: Update to support/enhance element behaviors
    update() {

        for (var i = 0; i < this.trackedObjects.length; i++) {
            let envTile = this.getEnvByXYPos(this.trackedObjects[i].position.x, this.trackedObjects[i].position.z);
            envTile.water -= this.trackedObjects[i].water;
        }

        this.balanceWaterTable();

    }

    //TODO update with flip flop for water/nutrients
    //TODO update registered objects

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