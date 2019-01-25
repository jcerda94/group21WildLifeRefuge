import React, { Component } from "react";
import "./css/App.css";
import WelcomePage from "./components/WelcomePage/WelcomePage";

import StudentView from "./components/StudentView";
import AuthorView from "./components/AuthorView";
import { getCapiInstance } from "./utils/CAPI/capi";

class App extends Component {
  capi = getCapiInstance()
  state = {
    loggedIn: false
  }

  handleLogin = () => {
    if (!this.state.loggedIn) {
      this.setState({ loggedIn: true });
    }
  }

  render () {
    let display = null;

    if (!this.state.loggedIn) {
      const name = this.capi.getValue({ key: "firstName" });
      display = <WelcomePage name={name} handleLogin={this.handleLogin} />;
    } else {
      display = <StudentView increment={this.increment} />;
    }

    return display;
  }
}

export default App;
