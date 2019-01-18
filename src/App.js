import React, { Component } from "react";
import "./css/App.css";
import model from "./model/capiModel";
import WelcomePage from "./components/WelcomePage";

import StudentView from "./components/StudentView";
import AuthorView from "./components/AuthorView";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(JSON.stringify(model));

    this.simModel = new window.simcapi.CapiAdapter.CapiModel(this.state);

    for (var key in this.state) {
      if (!this.state.hasOwnProperty(key)) continue;
      this.addListener(key);
      window.simcapi.CapiAdapter.expose(key, this.simModel);
    }

    // Todo: Refactor later to add appropriate listeners
    this.simModel.on("change:toggleContext", () => {
      this.simModel.set(
        "simContext",
        window.simcapi.Transporter.getConfig().context
      );

      switch (this.simModel.get("simContext")) {
        case "VIEWER":
          this.toggleOnThenAllOff("studentMode", "authorMode", "reviewMode");
          break;
        case "AUTHOR":
          this.toggleOnThenAllOff("authorMode", "studentMode", "reviewMode");
          break;
        default:
          console.log("Unsupported SimContext received");
      }
    });

    window.simcapi.CapiAdapter.unexpose("simObjects", this.simModel);
    window.simcapi.Transporter.notifyOnReady();

    this.increment = this.increment.bind(this);
  }

  // TODO: Refactor to actually check all available states instead of just three
  toggleOnThenAllOff(onState, off1, off2) {
    this.simModel.set(onState, true);

    this.simModel.set(off1, false);
    this.simModel.set(off2, false);
  }

  addListener(keyName) {
    this.simModel.on("change:" + keyName, () => {
      this.setState({
        [keyName]: this.simModel.get(keyName)
      });
    });
  }

  addSimulationElement(element) {
    switch (element) {
      case "redCedar":
        // TODO: Randomize Object parameters
        // var tree = new WesternRedCedar('medium', Math.floor(Math.random() * 12), (Math.random() >= 0.5));
        this.state.simObjects.push("Red_Cedar");
        break;
      case "redHawk":
        // TODO: Randomize Object parameters
        // var hawk = new RedTailedHawk('male', 'brown', 'medium', 'normal');
        this.state.simObjects.push("Red_Hawk");
        break;
      case "snowHare":
        // TODO: Randomize Object parameters
        // var snowHare = new SnowshoeHare('male', 'white', 'medium', 'normal');
        this.state.simObjects.push("Snowshoe_Hare");
        break;
      case "bigSage":
        // TODO: Randomize Object parameters
        // var sageBrush = new BigSagebrush();
        this.state.simObjects.push("Sage_Brush");
        break;
      case "blueGrass":
        // TODO: Add creation of Blue Bunch Wheatgrass Objects
        // TODO: Randomize Object parameters
        break;
      default:
        console.log("Unknown simulation element: " + element);
    }
  }

  increment(objectName) {
    var count = this.simModel.get(objectName);
    this.simModel.set(objectName, count + 1);

    this.addSimulationElement(objectName);
  }

  render() {
    // TODO: Add state checking using -> simcapi.Transporter.getConfig().context
    var display = null;
    if (!this.state.loggedIn) {
      display = <WelcomePage name={this.simModel} />;
    } else if (this.state.studentMode) {
      display = <StudentView increment={this.increment} />;
    } else if (this.state.authorMode) {
      display = (
        <AuthorView style={{ backgroundColor: "beige" }} state={this.state} />
      );
    }

    return display;
  }
}

export default App;
