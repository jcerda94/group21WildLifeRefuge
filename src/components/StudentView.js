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
                <img src = "/src/assets/back.png" alt = "back button"></img>
                <img src = "/src/assets/forward.png" alt = "forward button"></img>
                <img src = "/src/assets/help.png" alt = "help button"></img> {/* this image was licensed using an MIT license by Ionicons(ionicons.com).*/}
                <img src = "/src/assets/reset.png" alt = "reset button"></img> {/*this image was made by Danilo Demarco(http://www.danilodemarco.com)*/}
                
                
                <SimViewer height={this.state.height}/>

            </div>
        )


    }

}

export default StudentView