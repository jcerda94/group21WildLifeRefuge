import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import React, { Component } from "react";
import { getSceneManager } from "../scenes/SceneManager";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import SelectDropdown from "./Styled/SelectDropdown";

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  padding: 6px;
`;

const options = [
  "Default",
  "Top",
  "Bottom View",
  "Fly Control View",
  "First Person View"
];

class ViewControl extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selected: options[0]
    };
  }

  _onSelect = option => {
    const SceneManager = getSceneManager();
    const selected = option;

    this.setState({ selected });

    switch (selected) {
      case "Top":
        SceneManager.setCameraPosition(0, 500, 0);
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
        SceneManager.setDefaultCamera();
        break;
    }
  }

  render () {
    const { selected } = this.state;

    return (
      <Container>
        <h3>Select Views </h3>
        <SelectDropdown
          options={options}
          onChange={this._onSelect}
          value={selected}
          placeholder='Select an option'
        />
        <div className='result'>
          You selected <strong>{selected}</strong>
        </div>
      </Container>
    );
  }
}

export default ViewControl;
