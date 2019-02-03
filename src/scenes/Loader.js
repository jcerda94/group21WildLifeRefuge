import React, { Component}  from 'react';
import LoadingModels from "../components/LoadingModels";
import {getStudentView} from "../components/StudentView";
import { random } from "../utils/helpers";
import { getSceneManager } from "./SceneManager";
const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");



async function Loader () {
    console.log("Done Loading");



    const manager = new THREE.LoadingManager();
    var isLoading = true;
    manager.onStart=()=>{

        console.log("Start Loading");
        const studentView = getStudentView();
        studentView.whileLoading();

    }
    manager.onLoad=()=>{

        console.log("Done Loading");
        isLoading = false;
        const studentView = getStudentView();
        studentView.whileNotLoading();


    }
    const loader = new THREE.GLTFLoader(manager);


    const grasses = new THREE.Object3D();
    const originalGrass = await new Promise((resolve, reject) => {
        loader.load(
            "models/grass.gltf",
            grass => resolve(grass.scene || null),
            undefined,
            reject
        );
    });

    function update () {}

    return {
        update
    };
}
export const getLoader = () => {
    return Loader.instance || null;
};

export default function (container) {
    if (!Loader.instance) {
        Loader.instance = new Loader(container);
    }
    return Loader.instance;
}

