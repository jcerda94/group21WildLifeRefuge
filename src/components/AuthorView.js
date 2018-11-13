import React, { Component } from 'react';


class AuthorView extends Component {


    render(){
        return (
            <div style={this.props.style}>
                <pre> {JSON.stringify(this.props.state, undefined, 2)} </pre>
            </div>
        )
    }

}

export default AuthorView