import React, { Component } from "react";
import "./css/App.css";
import WelcomePage from "./components/WelcomePage/WelcomePage";

import StudentView from "./components/StudentView";
import AuthorView from "./components/AuthorView";
import LoadingModels from "./components/LoadingModels";

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
    return <LoadingModels/>;
  }
}

export default App;
