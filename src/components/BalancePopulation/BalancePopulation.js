import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import React, { Component } from "react";
import { getCapiInstance } from "../../utils/CAPI/capi";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import BalanceSelect from "./BalanceSelect";

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 6px;
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
      selected: options[0]
    };
  }

  _onSelect = option => {
    this.setState({ selected: option });

    const placeHolderValue =
      typeof this.state.selected === "string"
        ? this.state.selected
        : this.state.selected.label;

    this.simModel.setValue({ key: "answer", value: placeHolderValue });
  }

  render () {
    const { selected } = this.state;
    const placeHolderValue = this.state.selected;

    this.simModel.setValue({ key: "answer", value: placeHolderValue });

    return (
      <Container>
        <h3>What would you do? </h3>
        If there are too many snowshoe hares in wildlife refuge, what kind of
        population would you add to balance current ecosystem?
        <BalanceSelect
          options={options}
          onChange={this._onSelect}
          value={selected}
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
