import React, { Component } from "react";
import SceneManager from "../scenes/SceneManager";
import styled from "styled-components";
import ThreeEntry from "../scenes/ThreeEntry";

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
  }

  onClick = () => {
    this.sceneManager.resetCamera();
  }

  render () {
    return (
      <CanvasContainer ref={this.canvasContainer}>
        <Button onClick={this.onClick}>Reset Camera</Button>
      </CanvasContainer>
    );
  }
}

export default SimViewer;
