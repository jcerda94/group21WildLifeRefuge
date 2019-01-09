import React, { Component } from 'react';
import SimViewer from "./SimViewer";
class ImgButton extends Component {


    constructor(props) {
        super(props);

        // TODO: Need to add support for svg for custom button shapes
        if (this.props.hasOwnProperty('icon')) {
            if (this.props.id === 'reset') {
                this.click = () => {
                    SimViewer.scene.children[0].children = [];
                }
            } else {
                this.click = () => {
                    alert("Clicked " + this.props.id);
                }
            }
        }

    }

    render(){
        return <button id={this.props.id} onClick={(e) => this.click()}>
                    <img className={"ui-img"} alt="NOT LOADED" src={this.props.src}/>
                </button>;
    }
}
export default ImgButton