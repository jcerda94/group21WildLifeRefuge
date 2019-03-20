import React, { Component, Fragment } from "react";
import "./css/App.css";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import UIBar from "./components/UI/UIBar";
import StudentView from "./components/StudentView";
import styled from "styled-components";
import Drawer from "./components/UI/Drawer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BalancePopulation from "./components/BalancePopulation/BalancePopulation";
import ViewControl from "./components/ViewControl";
import PopUpInfo from "./components/PopUpInfo";
import DisplayTime from "./components/UI/DisplayTime";

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
      <Router>
        <Container className='appRoot'>
          <Route exact path='/' component={WelcomePage} />
          <Route
            path='/sim'
            component={() => (
              <Fragment>
                <UIBar />
                <StudentView />
                <PopUpInfo />
                <DisplayTime/>
                <Drawer
                  Content={() => (
                    <Fragment>
                      <Route component={BalancePopulation} />
                      <Route component={ViewControl} />
                    </Fragment>
                  )}
                />
              </Fragment>
            )}
          />
        </Container>
      </Router>
    );
  }
}

export default App;
