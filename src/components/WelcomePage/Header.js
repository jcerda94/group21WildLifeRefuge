import React, { Component } from "react";
import User from "../../js/User";

class Header extends Component {
    constructor(props) {
        super(props);
        this.simModel = props.name;
        this.user = new User(this.simModel.firstName, this.simModel.lastName, 6, 0,0);
    }

    render () {
        return (
                <header> Welcome {this.user.firstName} </header>
        )
    }
}

export default Header;