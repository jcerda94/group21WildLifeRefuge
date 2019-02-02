import React, { Component } from "react";
import User from "../../js/User";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  right: 0%;
  top: 0%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

class Header extends Component {
  render () {
    const { name } = this.props;
    return (
      <Container>
        <header>{`Welcome ${name}`}</header>
      </Container>
    );
  }
}

export default Header;
