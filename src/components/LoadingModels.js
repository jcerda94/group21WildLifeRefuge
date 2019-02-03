import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from "react";
import "../css/simulation.css";

import back from "../assets/back.png";
import forward from "../assets/forward.png";
import reset from "../assets/reset.png";
import help from "../assets/help.png";
import styled from "styled-components";
import ImgButton from "./UI/ImgButton";
import ResetButton from "./UI/ResetButton";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");


const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: papayawhip;
`;


class LoadingModels extends Component{
    constructor(props){
        super(props)



        this.state ={
            loading: false,
            grass: null
        }
    }
    async componentDidMount() {

        console.log("Called  did mount");
        const manager = new THREE.LoadingManager();
        var isLoading = true;
        manager.onStart = () => {

            console.log("Start Loading");


        }
        manager.onLoad = () => {

            console.log("Done Loading");
            isLoading = false;
            this.setState({
                loading: true,
                grass: originalGrass
            })


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


    }

    componentWillUnmount() {
    }


    render(){
        const {loading} = this.state;
        const Controls = (
            <React.Fragment>
                <ImgButton key="back" id="back" src={back} />
                <ImgButton key="forward" id="forward" src={forward} />
                <ResetButton key="reset" id="reset" src={reset} />
                <ImgButton key="help" id="help" src={help} />
            </React.Fragment>
        );

        if(loading == false)
        {
            return <CircularProgress disableShrink />;
        }
        return <div> Hello loader!!!</div>


    }


}
export const getLoadingModels = () => {
    return LoadingModels.instance || null;
};

export default function (container) {
    if (!LoadingModels.instance) {
        LoadingModels.instance = new LoadingModels(container);
    }
    return LoadingModels.instance;
}
