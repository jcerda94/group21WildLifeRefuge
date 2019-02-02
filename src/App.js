import React, { Component } from "react";
import "./css/App.css";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import UIBar from "./components/UI/UIBar";
import StudentView from "./components/StudentView";
import AuthorView from "./components/AuthorView";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import Drawer from "./components/UI/Drawer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

class App extends Component {
  state = {
    loggedIn: false
  }

  handleLogin = () => {
    if (!this.state.loggedIn) {
      this.setState({ loggedIn: true });
    }
  }

  render () {
    return (
      <Container className='appRoot'>
        <UIBar />
        <StudentView />
        <Drawer />
      </Container>
    );
  }
}

export default App;
