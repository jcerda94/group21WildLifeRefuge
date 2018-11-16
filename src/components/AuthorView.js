import React, { Component } from 'react';


class AuthorView extends Component {


    render(){
        return (
            <div style={this.props.style}>
                <h2>Sim State:</h2>
                <pre> {JSON.stringify(this.props.state, undefined, 2)} </pre>
            </div>
        )
    }

}

export default AuthorView