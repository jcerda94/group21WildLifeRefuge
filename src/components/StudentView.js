import React, { Component } from 'react';
import '../css/simulation.css'
import SimViewer from "./SimViewer";
import UIBar from "./UIBar";
import back from "../assets/back.png"
import forward from "../assets/forward.png"
import reset from "../assets/reset.png"
import help from "../assets/help.png"
import ImgButton from "./ImgButton";



class StudentView extends Component {


    constructor(props) {
        super(props);

        //TODO: Need to test reviewing behavior later
        this.state = {
            "increment": this.props.increment,
            'height': 0
        };

        /*// Disables increment functionality if in review mode
        // TODO: Add functionality to disable all UI except possible forward/back buttons
        if (this.props.hasOwnProperty('review')) {
            this.setState({
                'increment': (e) => console.log(e + ' is disabled')
            })
        }*/
    }

    findUIHeight = (uiHeight) => {
        this.setState({'height': (window.innerHeight-uiHeight)})
    };

    render(){

        return (
            <div className="student">
                <UIBar reportHeight={this.findUIHeight} increment={this.state.increment}/>
                <SimViewer height={this.state.height}/>

                <ImgButton key="back" icon id="back" src={back}/>
                <ImgButton key="forward" icon id="forward" src={forward}/>
                <ImgButton key="reset" icon id="reset" src={reset}/>
                <ImgButton key="help" icon id="help" src={help}/>
            </div>
        )


    }

}

export default StudentView