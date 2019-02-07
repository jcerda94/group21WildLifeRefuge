import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from "react";
import "../css/simulation.css";
import { getSceneManager } from "../scenes/SceneManager";


import styled from "styled-components";
import ImgButton from "./UI/ImgButton";
import ResetButton from "./UI/ResetButton";

const THREE = (window.THREE = require("three"));
require("three/examples/js/loaders/GLTFLoader");


const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 20px;
  bottom: 0;
  right: 0;
  
`;


class LoadingModels extends Component{


    constructor(props){
        super(props)



        this.state ={
            loading: false,
            grass: null
        }
    }

    goToSim = () => {
        const { history } = this.props;
        history && history.push("/sim");
    }

    componentDidMount = async () => {

        console.log("Called  did mount");
        const manager = new THREE.LoadingManager();
        var isLoading = true;
        manager.onStart = () => {

            console.log("Start Loading");


        }
        manager.onLoad = () => {

            isLoading = false;


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

        console.log("at loading 2 " + typeof originalGrass);
        //getSceneManager().setGrassMode(originalGrass);
        this.setState({
            loading: true,
            grass: originalGrass
        })
        console.log("at loading 2 " + this.state.grass);
        this.goToSim();


    };


    getGrass(){
        const {grass} = this.state;
        console.log("at loading 2  at get Grass" + grass);

        return grass;
    }
    componentWillUnmount() {
    }


    render(){
        const {originalGrass} = this.state;
        //console.log("at loading " + typeof originalGrass);
        const {loading} = this.state;



        {
            return (

                <Container>
                <CircularProgress disableShrink />

                <div> <br/>Loading ....</div>
                </Container>
            );
        }



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
