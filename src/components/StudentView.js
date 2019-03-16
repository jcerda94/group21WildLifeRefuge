import React, { Component } from "react";
import "../css/simulation.css";
import SimViewer from "./SimViewer";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
`;

class StudentView extends Component {
  render () {
    return (
      <Container>
        <SimViewer />
        <canvas hidden={true} id="drawing-canvas" height="1000" width="1000" style={{
          'backgroundColor': '996600', "cursor": "crosshair" }}/>
      </Container>
    );
  }
}

export default StudentView;
