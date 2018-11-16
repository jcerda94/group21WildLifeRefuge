import React, { Component } from 'react';
import StudentView from "./StudentView";


class ReviewView extends Component {


    //TODO: Add more complex report state/status
    //TODO: Need to create data structure to store previous student answers/responses for reviewing
    render(){
        const reviewState = {
            'questionState': this.props.questionState
        };

        return (
           <StudentView review={reviewState} props={this.props}/>
        )
    }

}

export default ReviewView