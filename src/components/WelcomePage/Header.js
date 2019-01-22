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
    constructor(props) {
        super(props);
        this.simModel = props.name;
        this.user = new User(this.simModel.firstName, this.simModel.lastName, 6, 0,0);
    }

    render () {
        return (
            <Container>
                <header> Welcome {this.user.firstName} </header>
            </Container>

        )
    }
}

export default Header;