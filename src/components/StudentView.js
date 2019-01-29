import React, { Component } from "react";
import "../css/simulation.css";
import SimViewer from "./SimViewer";
import UIBar from "./UI/UIBar";
import back from "../assets/back.png";
import forward from "../assets/forward.png";
import reset from "../assets/reset.png";
import help from "../assets/help.png";
import styled from "styled-components";
import ImgButton from "./UI/ImgButton";
import ResetButton from "./UI/ResetButton";
import { getCapiInstance } from "../utils/CAPI/capi";

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
      height: 0,
      data: { test: "test" }
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

  capi = getCapiInstance()

  getData = () => JSON.stringify(this.state.data, undefined, 2)
  getCapiData = () => {
    const T = this.capi.getTransporter();
    T.getDataRequest("stage", "wildlifesim.toggleContext", data =>
      this.setState({ data })
    );
  }
  render () {
    const Controls = (
      <React.Fragment>
        <ImgButton key='back' id='back' src={back} />
        <ImgButton key='forward' id='forward' src={forward} />
        <ResetButton key='reset' id='reset' src={reset} />
        <ImgButton key='help' id='help' src={help} />
      </React.Fragment>
    );
    return (
      <Container>
        <UIBar
          reportHeight={this.findUIHeight}
          increment={this.state.increment}
        />

        <button class='btn btn-primary' onClick={this.getCapiData}>
          Get Data
        </button>
        <div style={{ position: "absolute", top: "35%", right: 0 }}>
          {this.getData()}
        </div>
        {Controls}
        <SimViewer height={this.state.height} />
      </Container>
    );
  }
}

export default StudentView;
