import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  left: 15%;
  top: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Step = styled.span`
  color: #ffffff;
  font-size: 14px;
`;

class Steps extends Component {
  render () {
    const { steps } = this.props;

    return (
      <Container>
        {steps.map((step, i) => (
          <Step key={`${i}`}>{`${i + 1}.) ${step}`}</Step>
        ))}
      </Container>
    );
  }
}

Steps.defaultProps = {
  steps: []
};

export default Steps;
