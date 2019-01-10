import React from 'react';
import '../css/welcome.css';

import "../js/User.js";
import User from "../js/User";
class WelcomePage extends React.Component {

    constructor(props) {
        super(props);
        this.user = new User("Jonh", "Doe", 6, 0, 0);

        this.simModel = props.name;

        this.handleLoginClick = this.handleLoginClick.bind(this);

        this.state = {isLoggedIn: false};
    }
    handleLoginClick() {
        this.setState({isLoggedIn: true});
        this.simModel.set('loggedIn', true)
    }

    render() {

            return (

                <div>
                    <header>
                        {this.user.firstName} 

                    </header>

                    <h1>Welcome to Willapa National Wildlife Refuge</h1>
                    <h2>What do animals do in their free time?</h2>
                    <p>This is the refuge summary paragraph</p>
                    <div className="button">
                        <button className="enterButton" type="button" onClick = {this.handleLoginClick}> Start Lesson</button>
                    </div>
                </div>
            );
        }

}




export default WelcomePage