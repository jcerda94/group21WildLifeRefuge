import React, { Component } from "react";
import styled from "styled-components";
import ThreeEntry from "../scenes/ThreeEntry";
import { getSceneManager } from "../scenes/SceneManager";
import { getCapiInstance } from "../utils/CAPI/capi";

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

  render () {
    return <CanvasContainer ref={this.canvasContainer} />;
  }
}

export default SimViewer;
