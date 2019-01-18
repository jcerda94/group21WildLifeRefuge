import 'react-dat-gui/build/react-dat-gui.css';
import React, { Component } from 'react';


import DatGui, {DatBoolean, DatButton, DatNumber, DatSelect, DatString} from 'react-dat-gui';


class CamraControlUI extends Component {
    state = {
        data: {
            package: 'Choose a Camera',
            bloolean: 'true',
            select: 'one',
        }
    }

    handleUpdate = data => this.setState({data})

    render() {
        const {data} = this.state;

        return (
            <DatGui data={data} onUpdate={this.handleUpdate}>
                <DatString path='package' label='Camera Control'/>

                <DatBoolean path='bloolean' label='Camera ONE'/>

                <DatSelect label="Select" path='select' options={['two', 'three', 'four']}/>

            </DatGui>
        )
    }
}

export default CamraControlUI