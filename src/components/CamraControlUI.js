import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';

import DatGui, { DatBoolean, DatButton, DatNumber, DatString } from 'react-dat-gui';
import ElementButton from "./ElementButton";

class CamraControlUI extends Component {
    state = {
        data: {
            package: 'react-dat-gui',
            power: 9000,
            isAwesome: true,
            feelsLike: '#2FA1D6',
        }
    }

    handleUpdate = data => this.setState({data})

    render() {
        const {data} = this.state;

        return (
            <DatGui data={data} onUpdate={this.handleUpdate}>
                <DatString path='package' label='Package'/>
                <DatNumber path='power' label='Power' min={9000} max={9999} step={1}/>
                <DatBoolean path='isAwesome' label='Awesome?'/>

            </DatGui>
        )
    }
}

export default CamraControlUI