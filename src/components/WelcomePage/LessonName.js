import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.span`
  color: #FFFFFF;
  font-size: 32px;
`;

class LessonName extends Component {
  render () {
    const { name } = this.props;

    return (
      <Container>
        <Text>{name}</Text>
      </Container>
    );
  }
}

export default LessonName;