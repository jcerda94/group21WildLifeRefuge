import React from 'react';
import '../../css/welcome.css';
import UserImage from '../../assets/user1.png'
import LessonName from './LessonName';
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    background-color: #000000AA;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`

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
            <Container>
                <div> Welcome to Willapa Wildlife Refuge</div>
                <LessonName name="What do animals do in their free time?" />
                <p>This is the refuge summary paragraph</p>
                <button className="enterButton" type="button" onClick = {this.handleLoginClick}> Start Lesson</button>
                <i style={{fontSize: 48, color: 'white'}} class="fas fa-user"></i>
                <div className='spinner' />
                {/* <img style={{maxWidth: 100}} alt='user icon' src={UserImage}></img> */}
            </Container>
        );
    }
}




export default WelcomePage