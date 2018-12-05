import React, { Component } from 'react';
import '../css/simulation.css'
import SimViewer from "./SimViewer";
import UIBar from "./UIBar";


class StudentView extends Component {


    constructor(props) {
        super(props);

        //TODO: Need to test reviewing behavior later
        this.state = {
            "increment": this.props.increment,
            'height': 0
        };

        // Disables increment functionality if in review mode
        // TODO: Add functionality to disable all UI except possible forward/back buttons
        if (this.props.hasOwnProperty('review')) {
            this.setState({
                'increment': (e) => console.log(e + ' is disabled')
            })
        }
    }

    findUIHeight = (uiHeight) => {
        this.setState({'height': (window.innerHeight-uiHeight)})
    };

    render(){

        return (
            <div className="student">
                <UIBar reportHeight={this.findUIHeight} increment={this.state.increment}/>
                <a href="javascript:void(1)"><img id = 'back' src={Back} /></a>
                <a href="javascript:void(1)"><img id = 'forward' src={Forward} /></a>
                <a href="javascript:void(1)"><img id = 'reset' src={Reset} /></a>{/*this image was made by Danilo Demarco(http://www.danilodemarco.com)*/}
                <a href="javascript:void(1)"><img id = 'help' src={Help} /></a>{/* this image was licensed using an MIT license by Ionicons(ionicons.com).*/}
                <SimViewer height={this.state.height}/>

            </div>
        )


    }

}

export default StudentView