import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';


import DatGui, { DatBoolean, DatButton, DatNumber, DatString } from 'react-dat-gui';


class CamraControlUI extends Component {
    state = {
        data: {
            package: 'Choose a Camera',
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


            </DatGui>
        )
    }
}

export default CamraControlUI