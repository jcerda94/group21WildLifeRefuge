import React, { Component } from "react";
import "../css/simulation.css";
import SimViewer from "./SimViewer";
import UIBar from "./UIBar";
import FlatArrayExample from "./flatArray";
import back from "../assets/back.png";
import forward from "../assets/forward.png";
import reset from "../assets/reset.png";
import help from "../assets/help.png";
import ElementButton from "./ElementButton";
import styled from "styled-components";

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
  constructor(props) {
    super(props);

    //TODO: Need to test reviewing behavior later
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
  };

  render() {
    const Controls = (
      <React.Fragment>
        <ElementButton key="back" icon id="back" src={back} />
        <ElementButton key="forward" icon id="forward" src={forward} />
        <ElementButton key="reset" icon id="reset" src={reset} />
        <ElementButton key="help" icon id="help" src={help} />
      </React.Fragment>
    );
    return (
      <Container>
        <UIBar
          reportHeight={this.findUIHeight}
          increment={this.state.increment}
        />
        <FlatArrayExample/>
        <SimViewer height={this.state.height} />
      </Container>
    );
  }
}

export default StudentView;
