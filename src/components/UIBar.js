import React, { Component } from 'react';
import ElementButton from "./ElementButton";

class UIBar extends Component {


    componentDidMount() {
        this.props.reportHeight(this.divElement.clientHeight)
    }

    render(){

        return (
            <ul ref={divElement => {this.divElement = divElement}}>
                <ElementButton model="tree" key="rC" addText="Add Tree" title="Western Red Cedar" increment={this.props.increment} name="redCedar"/>
                <ElementButton model="remove tree" key="rmC" addText="Remove Tree" title="Western Red Cedar" increment={this.props.increment} name="redCedar"/>
                <ElementButton model="hawk" key="rH" addText="Add Predator" title="Red Tailed Hawk" increment={this.props.increment} name="redHawk"/>
                <ElementButton model="remove hawk" key="rmH" addText="Remove Hawk" title="Red Tailed Hawk" increment={this.props.increment} name="redCedar"/>
                <ElementButton model="hare" key="sH" addText="Add Prey" title="Snowshoe Hare" increment={this.props.increment} name="snowHare"/>
                <ElementButton model="Remove hare" key="rmH" addText="Remove Prey" title="Snowshoe Hare" increment={this.props.increment} name="snowHare"/>
                <ElementButton model="bush" key="bS" addText="Add Bushes" title="Big Sagebrush" increment={this.props.increment} name="bigSage"/>
                <ElementButton model="Remove bush" key="rmBS" addText="Remove Bushes" title="Big Sagebrush" increment={this.props.increment} name="bigSage"/>
                <ElementButton model="wheatgrass" key = "bW" addText= "Add Wheatgrass" title="BlueBunch Wheatgrass" increment={this.props.increment} name="blueBunch"/>
                <ElementButton model="Remove wheatgrass" key = "rmBW" addText= "Remove Wheatgrass" title="BlueBunch Wheatgrass" increment={this.props.increment} name="blueBunch"/>
            </ul>
        )
    }

}

export default UIBar