import React, { Component } from "react";
import "../css/simulation.css";
import SimViewer from "./SimViewer";
import ViewControl from "./ViewControl";
import UIBar from "./UI/UIBar";
import styled from "styled-components";
import BalancePopulation from "./BalancePopulation";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: papayawhip;
`;

class StudentView extends Component {
  constructor (props) {
    super(props);

    // TODO: Need to test reviewing behavior later
    this.state = {
      increment: this.props.increment,
      height: 0
    };

    // Disables increment functionality if in review mode
    // TODO: Add functionality to disable all UI except possible forward/back buttons
    if (this.props.hasOwnProperty("review")) {
      this.setState({
        increment: e => console.log(e + " is disabled")
      });
    }
  }

  findUIHeight = uiHeight => {
    this.setState({ height: window.innerHeight - uiHeight });
  }

  render () {
    return (
      <Container>
        <UIBar
          reportHeight={this.findUIHeight}
          increment={this.state.increment}
        />
        <ViewControl />
        <BalancePopulation />
        <SimViewer height={this.state.height} />
      </Container>
    );
  }
}

export default StudentView;
