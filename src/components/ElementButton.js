import React, { Component } from 'react';
import SimViewer from "./SimViewer";
import * as THREE from 'three';

class ElementButton extends Component {


    constructor(props) {
        super(props);

            this.button = // TODO: Refactor to use an HTML button or other type of component, use of null anchor tags is highly discouraged
                <li className="dropdown1">
                    <a href="javascript:void(1)" className="dropbtn2">{this.props.addText}</a>
                    <div className="dropdown-content1">
                        <a onClick={(e) => this.addElementClick()} href="#">{this.props.title}</a>
                    </div>
                </li>;

    }
        addElementClick = () => {

            this.props.increment(this.props.name);

        // TODO: This code will only load basic cube geometries, needs to be modified to load element models
        var color;
        switch (this.props.model) {
            case 'tree':
                color = new THREE.Color( 0x996600);
                break;
            case 'hawk':
                color = new THREE.Color(0xcc0000);
                break;
            case 'bush':
                color = new THREE.Color(0x669900);
                break;
            case 'hare':
                color = new THREE.Color(0xd9d9d9);
                break;

        }

        var geometry = new THREE.BoxGeometry( 3, 3, 3 );
        var material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh( geometry, material );
        cube.position.x = (Math.random() - 0.5) * 90;
        cube.position.y = (Math.random() - 0.5) * 90;
        cube.position.z = 1;

        SimViewer.plane.add(cube);

        console.log(SimViewer.scene.children)
    };

    render(){
        return this.button;
    }
}
export default ElementButton