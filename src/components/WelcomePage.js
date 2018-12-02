import React from 'react';
import ReactDOM from 'react-dom';
import '../css/welcome.css';
import model from '../model/capiModel';




class WelcomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(model));

        this.simModel = props.name;
        this.simModel.set('level', 4);
        console.log("show me", this.simModel.get('level'));
        console.log(this.simModel);
        this.simModel.set("level", 4);
      // this.simModel = new window.simcapi.CapiAdapter.CapiModel(this.state);

        this.handleLoginClick = this.handleLoginClick.bind(this);

        this.state = {isLoggedIn: false};
    }
    handleLoginClick() {
        this.setState({isLoggedIn: true});
        this.simModel.set('loggedIn', false)
    }

    render() {

        const isLoggedIn = this.state.isLoggedIn;
        let button;
        if (isLoggedIn) {
            button = "me";
            return(
                <div>

                </div>);

        } else {


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
}




export default WelcomePage