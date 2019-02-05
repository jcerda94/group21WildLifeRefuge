import React, { Component } from "react";
import { getSceneManager } from "./SceneManager";
import Cube from "./Cube";
import { random } from "../utils/helpers";
import Hawk from "./Hawk";


function AddModels(model) {
    this.state= ({
      model1: model,
    })


        let color = null;
        const SceneManager = getSceneManager();
        const {model1} = this.state;



        switch ((String)(model1)) {

            case "tree":
                console.log("I am creating " + model1);
                color = "#00C060";
                break;
            case "hawk":
                console.log("I am creating " + model1);
                color = 0xcc0000;
                SceneManager.addObject(new Hawk(SceneManager.scene));
                return;
                break;
            case 'bush':
                console.log("I am creating " + model1);
                color = 0x669900;
                break;
            case "hare":
                console.log("I am creating " + model1);
                color = 0xd9d9d9;
                break;
            default:

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

export default AddModels


