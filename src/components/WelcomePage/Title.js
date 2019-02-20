import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.h1`
  color: #FFFFFF;
  font-size: 36px;
`;

class Title extends Component {
  render () {
    const { title } = this.props;

    return (
      <Container>
        <Text>{title}</Text>
      </Container>
    );
  }
}

export default Title;