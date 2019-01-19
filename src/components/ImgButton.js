import React, { Component } from 'react';
import {getSceneManager} from "../scenes/SceneManager";
class ImgButton extends Component {


    constructor(props) {
        super(props);

        // TODO: Need to add support for svg for custom button shapes, currently transparancey can be clicked on 
        if (this.props.hasOwnProperty('icon')) {
            if (this.props.id === 'reset') {
                this.click = () => {
                    var SceneManager = getSceneManager();
                    for (var i = SceneManager.scene.children.length - 1; i >= 0;  i--) {
                        if (SceneManager.scene.children[i].type === "SimElement"){
                            SceneManager.scene.children.splice(i, 1);
                        }

                    }

                };
            } else {
                this.click = () => {
                    alert("Clicked " + this.props.id);
                };
            }
        }

    }

    render(){
        return <button id={this.props.id} onClick={(e) => this.click()}>
                    <img className={"ui-img"} alt="NOT LOADED" src={this.props.src}/>
                </button>;
    }
}
export default ImgButton;