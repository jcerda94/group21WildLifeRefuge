import React, { Component } from 'react';
import '../css/simulation.css'
import ElementButton from "./ElementButton";


class StudentView extends Component {


    constructor(props) {
        super(props);

        //TODO: Need to test reviewing behavior later
        this.state = {
          "increment": this.props.increment
        };

        // Disables increment functionality if in review mode
        // TODO: Add functionality to disable all UI except possible forward/back buttons
        if (this.props.hasOwnProperty('review')) {
            this.setState({
                'increment': (e) => console.log(e + ' is disabled')
            })
        }
    }

    render(){

        return (
            <div className="student">
                <ul>
                    <ElementButton key="rC" addText="Add Tree" title="Western Red Cedar" increment={this.state.increment} name="redCedar"/>
                    <ElementButton key="rH" addText="Add Predator" title="Red Tailed Hawk" increment={this.state.increment} name="redHawk"/>
                    <ElementButton key="sH" addText="Add Prey" title="Snowshoe Hare" increment={this.state.increment} name="snowHare"/>
                    <ElementButton key="bS" addText="Add Bushes" title="Big Sagebrush" increment={this.state.increment} name="bigSage"/>
                </ul>

            </div>
        )


    }

}

export default StudentView