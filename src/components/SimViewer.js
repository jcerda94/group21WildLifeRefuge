import React, { Component } from 'react';
import SceneManager from '../scenes/SceneManager';
import styled from 'styled-components';
import ThreeEntry from '../scenes/ThreeEntry';

const CanvasContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

class SimViewer extends Component {
  canvasContainer = React.createRef()

  componentDidMount () {
    new ThreeEntry(this.canvasContainer.current);
  }

  render () {
    return <CanvasContainer ref={this.canvasContainer} />;
  }
}

export default SimViewer;
