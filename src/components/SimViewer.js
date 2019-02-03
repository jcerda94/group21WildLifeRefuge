import React, { Component } from "react";
import styled from "styled-components";
import ThreeEntry from "../scenes/ThreeEntry";
import { getSceneManager } from "../scenes/SceneManager";
import { getCapiInstance } from "../utils/CAPI/capi";
import LoadingModels from "./LoadingModels";

const CanvasContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Button = styled.div`
  padding: 14px;
  color: white;
  font-size: 18px;
  text-align: center;
  border-radius: 20px;
  background-color: tomato;
  position: absolute;
  top: 85px;
  left: 25px;
  cursor: pointer;
  user-select: none;
`;

class SimViewer extends Component {
  canvasContainer = React.createRef()
  constructor (props) {
    super(props);

    // TODO: Need to test reviewing behavior later
    this.state = {
      increment: this.props.increment,
      height: 0,
      loading: true
    };
  }

    componentDidMount () {
    this.sceneManager = new ThreeEntry(
      this.canvasContainer.current
    ).sceneManager;

    const capi = getCapiInstance();
    const Transporter = capi.getTransporter();
    Transporter.addInitialSetupCompleteListener(() => {
      getSceneManager().onTransporterReady();
    });
    Transporter.notifyOnReady();
  }

  onClick = () => {
    this.sceneManager.resetCamera();
  }

  whileLoading(){

    this.setState({
      loading: true

    })
  }

  whileNotLoading(){

    this.setState({
      increment: this.props.increment,
      height: 0,
      loading: false

    })
  }

  render () {

    const {loading} = this.state;
    if(loading == true){
      return( <div>
        <CanvasContainer ref={this.canvasContainer} />  </div>);

    }
    return <CanvasContainer ref={this.canvasContainer} />;
  }
}

export const getSivView = () => {
  return SimViewer.instance || null;
};


export default function (container) {
  if (!SimViewer.instance) {
    SimViewer.instance = new SimViewer(container);
  }
  return SimViewer.instance;
}

