import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import React, { Component } from "react";
import { getSceneManager } from "../scenes/SceneManager";

const options = [
  "Top",
  "Bottom View",
  "Fly Control View",
  "First Person View",
  "Default"
];

class ViewControl extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selected: "Top"
    };
    this._onSelect = this._onSelect.bind(this);
  }

  _onSelect (option) {
    const SceneManager = getSceneManager();

    this.setState({ selected: option });
    var selected = option.label;

    switch (selected) {
      case "Top":
        SceneManager.setCameraPosition(0, 500, 0);
        console.log("You selected ", option.label);
        break;
      case "Bottom View":
        SceneManager.setCameraPosition(0, 10, 100);
        break;
      case "Fly Control View":
        SceneManager.setFlyControlCamera();

        break;
      case "First Person View":
        break;
      default:
        SceneManager.setCameraPosition(0, 75, 500);
        break;
    }
  }

  render () {
    const defaultOption = this.state.selected;
    const placeHolderValue =
      typeof this.state.selected === "string"
        ? this.state.selected
        : this.state.selected.label;

    return (
      <section>
        <h3>Select Views </h3>
        <Dropdown
          options={options}
          onChange={this._onSelect}
          value={defaultOption}
          placeholder='Select an option'
        />
        <div className='result'>
          You selected
          <strong> {placeHolderValue} </strong>
        </div>
      </section>
    );
  }
}

export default ViewControl;
