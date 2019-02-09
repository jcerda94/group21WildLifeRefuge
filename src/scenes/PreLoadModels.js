import React, { Component } from "react";
import { getSceneManager } from "./SceneManager";
import Cube from "./Cube";
import { random } from "../utils/helpers";
import Hawk from "./Hawk";
import Tree from "./Tree";
import Hare from "./Hare";
import Bush from "./Bush";



const numberOfTree = 20;
function PreLoadModels(model) {
    this.state= ({
        model1: model,
    });
    let color = null;
    const SceneManager = getSceneManager();
    for(var i = 0; i <numberOfTree; i++){
        SceneManager.addObject(new Tree(SceneManager.scene));
    }

    function update () {}

    return {
        update
    };

}

export default PreLoadModels;


