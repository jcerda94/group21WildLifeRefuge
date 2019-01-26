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
    return <StudentView />;
  }
}

export default App;
