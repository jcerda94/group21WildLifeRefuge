import React, { Component } from "react";
import "../css/simulation.css";
import SimViewer from "./SimViewer";
import ViewControl from "./ViewControl";
import UIBar from "./UI/UIBar";
import back from "../assets/back.png";
import forward from "../assets/forward.png";
import reset from "../assets/reset.png";
import help from "../assets/help.png";
import styled from "styled-components";
import ImgButton from "./UI/ImgButton";
import ResetButton from "./UI/ResetButton";
import BalancePopulation from "./BalancePopulation";
import LoadingModels from "./LoadingModels";
import GrassField from "../scenes/GrassField";

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
      loading: false
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
  whileLoading(){
      this.setState({
          loading: true

      })
  }

    whileNotLoading(){
        this.setState({
            loading: false

        })
    }
  render () {

    const {loading} = this.state;
    console.log("is loading value is ==> " + loading );
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
                {Controls}
                <ViewControl/>
                <BalancePopulation/>

                <SimViewer height={this.state.height}/>
            </Container>
        );
    }

}

//export default StudentView;


export const getStudentView = () => {
    return StudentView.instance || null;
};


export default function (container) {
    if (!StudentView.instance) {
        StudentView.instance = new StudentView(container);
    }
    return SubtleCrypto.instance;
}
