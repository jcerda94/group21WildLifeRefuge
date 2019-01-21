import React, { Component } from "react";
import { getSceneManager } from "../../scenes/SceneManager";
import Cube from "../../scenes/Cube";

class ElementButton extends Component {
  constructor (props) {
    super(props);

    // TODO: Refactor to use an HTML button or other type of component, use of null anchor tags is highly discouraged
    this.button = (
      <div className='dropdown'>
        <button className='dropbtn'>{this.props.addText}</button>
        <div className='dropdown-content'>
          <button onClick={e => this.onClick()}>{this.props.title}</button>
        </div>
      </div>
    );
  }

  onClick = e => {
    e.preventDefault();
    this.props.increment(this.props.name);

    var color;
    switch (this.props.model) {
      case "tree":
        color = "#00C060";
        break;
      case "hawk":
        color = 0xcc0000;
        break;
      case "bush":
        color = 0x669900;
        break;
      case "hare":
        color = 0xd9d9d9;
        break;
      default:
        break;
    }
    function random (min, max) {
      return Math.random() * (max - min) + min;
    }

    const SceneManager = getSceneManager();

    const widthBound = (0.95 * SceneManager.groundSize.x) / 2;
    const heightBound = (0.95 * SceneManager.groundSize.y) / 2;

    const x = random(-widthBound, widthBound);
    const y = 1.5;
    const z = random(-heightBound, heightBound);
    const position = { x, y, z };

    const cubeConfig = {
      size: 3,
      position,
      color
    };

    SceneManager.addObject(new Cube(SceneManager.scene, cubeConfig));
  }

  render () {
    return this.button;
  }
}
export default ElementButton;
