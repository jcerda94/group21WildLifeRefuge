import React, { Component } from "react";
import ElementButton from "./ElementButton";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  background-color: #303030;
`;

class UIBar extends Component {
  render () {
    return (
      <Container>
        <ElementButton
          model='tree'
          key='rC'
          addText='Add Tree'
          title='Western Red Cedar'
          increment={this.props.increment}
          name='redCedar'
        />
         <ElementButton model="remove tree" key="rmC" addText="Remove Tree" title="Western Red Cedar" 
                increment={this.props.increment} name="redCedar"/>;
        <ElementButton
          model='hawk'
          key='rH'
          addText='Add Predator'
          title='Red Tailed Hawk'
          increment={this.props.increment}
          name='redHawk'
        />
        <ElementButton model="remove hawk" key="rmH" addText="Remove Hawk" title="Red Tailed Hawk" 
                increment={this.props.increment} name="redCedar"/>;
                
        <ElementButton
          model='hare'
          key='sH'
          addText='Add Prey'
          title='Snowshoe Hare'
          increment={this.props.increment}
          name='snowHare'
        />
        <ElementButton model="Remove hare" key="rmH" addText="Remove Prey" title="Snowshoe Hare" 
                increment={this.props.increment} name="snowHare"/>;
                
        <ElementButton
          model='bush'
          key='bS'
          addText='Add Bushes'
          title='Big Sagebrush'
          increment={this.props.increment}
          name='bigSage'
        />
        <ElementButton model="Remove bush" key="rmBS" addText="Remove Bushes" title="Big Sagebrush" 
                increment={this.props.increment} name="bigSage"/>;
        <ElementButton model="wheatgrass" key = "bW" addText= "Add Wheatgrass" title="BlueBunch Wheatgrass" 
                increment={this.props.increment} name="blueBunch"/>;
        <ElementButton model="Remove wheatgrass" key = "rmBW" addText= "Remove Wheatgrass" 
                title="BlueBunch Wheatgrass" increment={this.props.increment} name="blueBunch"/>;
            
      </Container>
    );
  }
}

export default UIBar;
