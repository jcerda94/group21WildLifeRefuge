import React, { Component } from 'react';
import SimViewer from './SimViewer';
import { getSceneManager } from '../scenes/SceneManager';
import * as THREE from 'three';

class ElementButton extends Component {
  constructor (props) {
    super(props);

    // TODO: Need to add support for svg for custom button shapes
    if (this.props.hasOwnProperty('icon')) {
      var click;
      if (this.props.id === 'reset') {
        click = () => {
          SimViewer.scene.children[0].children = [];
        };
      } else {
        click = () => {
          alert('Clicked ' + this.props.id);
        };
      }

      this.button = (
        <button id={this.props.id} onClick={e => click()}>
          <img className={'ui-img'} alt='NOT LOADED' src={this.props.src} />
        </button>
      );
    } else {
      var onClick = () => {
        this.props.increment(this.props.name);

        var color;
        switch (this.props.model) {
          case 'tree':
            color = new THREE.Color('#00C060');
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
          default:
            break;
        }

        var geometry = new THREE.BoxGeometry(3, 3, 3);
        var material = new THREE.MeshBasicMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        function random (min, max) {
          return Math.random() * (max - min) + min;
        }
        const x = random(-48, 48);
        const y = random(-48, 48);
        cube.position.set(x, 1.5, y);
        cube.scale.set(1, 1, 1);
        getSceneManager().addObject(cube);
      };

      this.button = ( // TODO: Refactor to use an HTML button or other type of component, use of null anchor tags is highly discouraged
        <li className='dropdown1'>
          <a href='javascript:void(1)' className='dropbtn2'>
            {this.props.addText}
          </a>
          <div className='dropdown-content1'>
            <a onClick={e => onClick()} href='#'>
              {this.props.title}
            </a>
          </div>
        </li>
      );
    }
  }

  render () {
    return this.button;
  }
}
export default ElementButton;
