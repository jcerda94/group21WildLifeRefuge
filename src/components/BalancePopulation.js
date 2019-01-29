
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import React, { Component } from 'react';
import { getSceneManager } from '../scenes/SceneManager';

import styled from "styled-components";

const Container = styled.div`

  position: absolute;
  left: 2%;
  top: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #67F07F;   
  width: 10%
`;



const options = [
    'None', 'Snowshoe Hare', 'Big Sage Brush', 'Bluebunch Wheat Grass', 'Red Tail Hawk', 'Western Red Cedar Tree'
]

class BalancePopulation extends Component {
    constructor (props) {
        super(props)
        this.state = {
            selected: "Select an option",
            simModel: props.sim,
        }
        this._onSelect = this._onSelect.bind(this)
    }

    _onSelect (option) {
        const SceneManager = getSceneManager();

        this.setState({selected: option})
        var selected = option.label;

        switch (selected) {

            case 'Top':
                SceneManager.setCameraPosition(0,500,0);
                console.log('You selected ', option.label)
                break;
            case 'Bottom View':
                SceneManager.setCameraPosition(0,10,100);
                break;
            case 'Fly Control View':
                SceneManager.setFlyControlCamera();

                break;
            case 'First Person View':

                break;
            default:
                SceneManager.setCameraPosition(0,75,500);
                break;
        }

    }

    render () {
        const defaultOption = this.state.selected
        const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label

       this.simModel.firstName= placeHolderValue;

        return (
            <Container>
                <h3>What would you do? </h3>
                If there are too many snowshoe hares in wildlife refuge, what kind of population would you add to balance
                    current ecosystem?
                <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
                <div className='result'>
                    You selected
                    <strong> {placeHolderValue} </strong>
                </div>


            </Container>
        )
    }
}

export default BalancePopulation;