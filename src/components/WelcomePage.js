import React from 'react';
import ReactDOM from 'react-dom';
import '../css/welcome.css';


class WelcomePage extends React.Component {

    constructor(props) {
        super(props);

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