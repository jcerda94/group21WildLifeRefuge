import React, { Component } from "react";
import { getSceneManager } from "./SceneManager";
import Cube from "./Cube";
import { random } from "../utils/helpers";
import Hawk from "./Hawk";
import Tree from "./Tree";
import Hare from "./Hare";
import Bush from "./Bush";


function AddModels(model) {
    this.state= ({
      model1: model,
    });
        let color = null;
        const SceneManager = getSceneManager();
        const {model1} = this.state;

        //console.log("AddModels:  model1: " + (String)(model1));
        for (var i = SceneManager.scene.children.length - 1; i >= 0;  i--) {
            //console.log("current models[%d]: %s", i, SceneManager.scene.children[i].type);
            }

        switch ((String)(model1)) {

            case "tree":
                color = "#00C060";
               SceneManager.addObject(new Tree(SceneManager.scene));
               return;
                break;
            case "hawk":
                color = 0xcc0000;
                SceneManager.addObject(new Hawk(SceneManager.scene));
                return;
                break;
            case "bush":
                SceneManager.addObject(new Bush(SceneManager.scene));
                color = 0x669900;
                return;
                break;
            case "hare":
                SceneManager.addObject(new Hare(SceneManager.scene));
                 color = 0xd9d9d9;
                 return;
                 break;
            default:
                // grass isn't handled
          //      console.log("AddModels:  Unknown model: " + (String)(model1));
                break;
        }

        const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
        const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

        const x = random(-widthBound, widthBound);
        const y = 1.5;
        const z = random(-heightBound, heightBound);
        const position = { x, y, z };

        const cubeConfig = {
            size: 3,
            position,
            color
        };

        SceneManager.addObject(new Cube(SceneManager.scene, cubeConfig));
        function update () {}

    return {
        update
    };

}

export default AddModels; 


