import React, { Component } from 'react';
import ElementButton from "./ElementButton";


class UIBar extends Component {


    componentDidMount() {
        this.props.reportHeight(this.divElement.clientHeight)
    }

    render(){

        return (
            <ul ref={divElement => {this.divElement = divElement}}>
                <ElementButton key="rC" addText="Add Tree" title="Western Red Cedar" increment={this.props.increment} name="redCedar"/>
                <ElementButton key="rH" addText="Add Predator" title="Red Tailed Hawk" increment={this.props.increment} name="redHawk"/>
                <ElementButton key="sH" addText="Add Prey" title="Snowshoe Hare" increment={this.props.increment} name="snowHare"/>
                <ElementButton key="bS" addText="Add Bushes" title="Big Sagebrush" increment={this.props.increment} name="bigSage"/>
            </ul>
        )
    }

}

export default UIBar