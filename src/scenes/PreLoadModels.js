import React, { Component } from "react";
import { getSceneManager } from "./SceneManager";
import Cube from "./Cube";
import { random } from "../utils/helpers";
import Hawk from "./Hawk";
import Tree from "./Tree";
import Hare from "./Hare";
import Bush from "./Bush";



const numberOfTree = 20;
const numberOfHare = 10;
const numberOfHawk = 5;
const numberOfBush = 25;
function PreLoadModels(model) {
    this.state= ({
        model1: model,
    });

    const SceneManager = getSceneManager();
    for(var i = 0; i <numberOfTree; i++){
        SceneManager.addObject(new Tree(SceneManager.scene));
    }
    for(var i = 0; i <numberOfBush; i++){
        SceneManager.addObject(new Bush(SceneManager.scene));
    }
    for(var i = 0; i <numberOfHawk; i++){
        SceneManager.addObject(new Hawk(SceneManager.scene));
    }
    for(var i = 0; i <numberOfHare; i++){
        SceneManager.addObject(new Hare(SceneManager.scene));
    }



    function update () {}

    return {
        update
    };

}

export default PreLoadModels;


