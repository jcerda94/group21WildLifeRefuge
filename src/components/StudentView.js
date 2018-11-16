import React, { Component } from 'react';
import '../css/simulation.css'


class StudentView extends Component {


    constructor(props) {
        super(props);

        //TODO: Need to test reviewing behavior later
        this.state = {
          "increment": this.props.increment
        };

        if (this.props.hasOwnProperty('review')) {
            this.setState({
                'increment': (e) => console.log(e + ' is disabled')
            })
        }
    }

    render(){

        return (
            <div className="student">
                <ul>
                    <li className="dropdown1">
                        <a href="javascript:void(1)" className="dropbtn2">Add Predators </a>
                        <div className="dropdown-content1">
                            <a onClick={(e) => this.state.increment('redCedar')} href="#">Western Red Cedar</a>
                        </div>
                    </li>
                    <li className="dropdown2">
                        <a href="javascript:void(1)" className="dropbtn2">Add Predators </a>
                        <div className="dropdown-content2">
                            <a onClick={(e) => this.state.increment('redHawk')} href="#">Red Tailed Hawk</a>
                        </div>
                    </li>
                    <li className="dropdown3">
                        <a href="javascript:void(2)" className="dropbtn3">Add Prey</a>
                        <div className="dropdown-content3">
                            <a onClick={(e) => this.state.increment('snowHare')} href="#">Snowshoe Hare</a>
                        </div>
                    </li>
                    <li className="dropdown4">
                        <a href="javascript:void(2)" className="dropbtn4">Add Bushes</a>
                        <div className="dropdown-content4">
                            <a onClick={(e) => this.state.increment('bigSage')} href="#">Big Sagebrush</a>
                        </div>
                    </li>
                </ul>

            </div>
        )


    }

}

export default StudentView