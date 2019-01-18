import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import React, { Component } from 'react';
import SimViewer from './SimViewer';
import { getSceneManager } from '../scenes/SceneManager';
import * as THREE from 'three';
import Cube from "../scenes/Cube";
import {Camera} from "three";

const options = [
    'Top', 'Bottom View', 'Flyby View', 'First Person View'
]

class FlatArrayExample extends Component {
    constructor (props) {
        super(props)
        this.state = {
            selected: 'Top'
        }
        this._onSelect = this._onSelect.bind(this)
    }

    _onSelect (option) {
        const SceneManager = getSceneManager();

        this.setState({selected: option})
        var selected = option.label;

        switch (selected) {

            case 'Top':
               SceneManager.setCameraPostion(0,400,800);
               console.log('You selected ', option.label)
                break;
            case 'Bottom View':
                SceneManager.setCameraPostion(0,10,100);
                break;
            case 'Flyby View':

                break;
            case 'First Person View':

                break;
            default:
                SceneManager.setCameraPostion(0,75,100);
                break;
        }

    }

    render () {
        const defaultOption = this.state.selected
        const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label

        return (
            <section>
                <h3>Select Views </h3>
                <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
                <div className='result'>
                    You selected
                    <strong> {placeHolderValue} </strong>
                </div>


            </section>
        )
    }
}

export default FlatArrayExample