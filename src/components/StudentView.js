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
      </Container>
    );
  }
}

export default StudentView;
