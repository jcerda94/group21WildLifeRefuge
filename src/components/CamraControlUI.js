import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';


import DatGui, { DatBoolean, DatButton, DatNumber, DatString } from 'react-dat-gui';


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
                <DatString path='package' label='Camera Control'/>

                <DatBoolean path='bloolena' label='Camera ONE'/>
                <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
                <DatBoolean path='boolean' label='Camera TWO'/>
                <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
            
                <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />

                <DatBoolean path='isAwesome' label='Camera THREE'/>
                <DatNumber path='power' label='Power' min={9000} max={9999} step={1} />
                <DatBoolean path='isAwesome' label='Camera FOUR'/>

            </DatGui>
        )
    }
}

export default CamraControlUI