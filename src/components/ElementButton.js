import React, { Component } from 'react';
class ElementButton extends Component {

    render(){
        return (
            // TODO: Refactor to use an HTML button or other type of component, use of null anchor tags is highly discouraged
            <li className="dropdown1">
                <a href="javascript:void(1)" className="dropbtn2">{this.props.addText}</a>
                <div className="dropdown-content1">
                    <a onClick={(e) => this.props.increment(this.props.name)} href="#">{this.props.title}</a>
                </div>
            </li>
        )
    }
}
export default ElementButton