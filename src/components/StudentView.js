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

                <SimViewer height={this.state.height}/>

            </div>
        )


    }

}

export default StudentView