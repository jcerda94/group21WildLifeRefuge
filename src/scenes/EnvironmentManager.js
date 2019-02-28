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

// TODO: Maybe use this to generate the ground plane? Or have the ground plane model be generated and then sampled?
class EnvironmentManager {

    textureCanvas = null;
    localEnv = null;
    defaultEnvironmentObject = {
      water: 1.0
    };

    constructor(){
        const sceneManger = getSceneManager();

        //Added 1 to array size to handle odd ground sizes (1222 x 899) and objects at the absolute edge of the ground
        const groundX = Math.trunc(sceneManger.groundSize.x/10) + 1;
        const groundY = Math.trunc(sceneManger.groundSize.y/10) + 1;

        //Initializes an array shaped like our ground object, and fills it with a set of default environment conditions
        //TODO: Add dynamically generated environments (non-uniform starting conditions, maybe toy environment 'painter')
        this.localEnv = [...Array(groundX)].map(x=>Array(groundY).fill(Object.assign({}, this.defaultEnvironmentObject)));
        console.log(this.localEnv);

        // Creates a THREE Texture using an HTML Canvas element
        var drawingCanvas = document.getElementById( 'drawing-canvas' );
        var drawingContext = drawingCanvas.getContext( '2d' );
        drawingContext.fillStyle = '#996600';
        drawingContext.fillRect( 0, 0, sceneManger.groundSize.x, sceneManger.groundSize.y);
        this.textureCanvas = drawingCanvas;

    }

    getEnvByXYPos(x, y){
        const envArrX = Math.trunc(x/10);
        const envArrY = Math.trunc(y/10);

        return this.local_env[envArrX][envArrY];
    }

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