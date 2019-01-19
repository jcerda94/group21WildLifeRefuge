import React, { Component } from 'react';
import {getSceneManager} from "../../scenes/SceneManager";
import ImgButton from "./ImgButton";

class ResetButton extends Component {


    constructor(props) {
        super(props);

        this.click = () => {
                // Goes through the Array SceneManager.scene.children backwards and removes Objects that have
                // the type "SimElement"
                var SceneManager = getSceneManager();
                for (var i = SceneManager.scene.children.length - 1; i >= 0;  i--) {
                    if (SceneManager.scene.children[i].type === "SimElement"){
                        SceneManager.scene.children.splice(i, 1);
                    }

                }

            };
    }

    render(){
        return <ImgButton {...this.props} onClick={(e) => this.click()} />;
    }
}
export default ResetButton;