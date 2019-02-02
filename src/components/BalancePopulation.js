import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import React, { Component } from "react";
import { getCapiInstance } from "../utils/CAPI/capi";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  left: 2%;
  top: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #67f07f;
  width: 15%;
`;

const options = [
  "None",
  "Snowshoe Hare",
  "Big Sage Brush",
  "Bluebunch Wheat Grass",
  "Red Tail Hawk",
  "Western Red Cedar Tree"
];

class BalancePopulation extends Component {
  constructor (props) {
    super(props);

    this.simModel = getCapiInstance();
    this.state = {
      selected: "Select an option"
    };
    this._onSelect = this._onSelect.bind(this);
  }

  _onSelect (option) {
    this.setState({ selected: option });

    const placeHolderValue =
      typeof this.state.selected === "string"
        ? this.state.selected
        : this.state.selected.label;

    this.simModel.setValue({ key: "answer", value: placeHolderValue });
  }

  render () {
    const defaultOption = this.state.selected;
    const placeHolderValue =
      typeof this.state.selected === "string"
        ? this.state.selected
        : this.state.selected.label;

    this.simModel.setValue({ key: "answer", value: placeHolderValue });

    return (
      <Container>
        <h3>What would you do? </h3>
        If there are too many snowshoe hares in wildlife refuge, what kind of
        population would you add to balance current ecosystem?
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
      </Container>
    );
  }
}

export default BalancePopulation;
