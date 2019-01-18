import React from 'react';
import '../../css/welcome.css';
import UserImage from '../../assets/user1.png'
import LessonName from './LessonName';
import Steps from './Steps';
import styled from 'styled-components'
import Title from './Title';
import Loading from '../Styled/Loading';
import Summary from './Summary';
import VerticalLine from './VerticalLine';
import Button from '../Styled/Button';

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

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("assets/willapa-wildlife-refuge-hiking.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
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
            <React.Fragment>
                <Background />
                <Container>
                    <Title title = "Welcome to Willapa Wildlife Refuge"/>
                    <VerticalLine height={80} color='white' />
                    <LessonName name="What do animals do in their free time?" />
                    <VerticalLine height={360} color='white' />
                    <Steps
                        steps={[
                            "Add animals",
                            "Observe their interactions",
                            "Watch as hawks dominate the ecosystem",
                            "More steps to come"
                        ]}
                    />
                    <Button label='Hello' />
                    <Summary summary = "This is the summary paragraph from ReactJS" />
                    <button className="enterButton" type="button" onClick = {this.handleLoginClick}> Start Lesson</button>
                    {/* <img style={{maxWidth: 100}} alt='user icon' src={UserImage}></img> */}
                </Container>
            </React.Fragment>
        );
    }
}




export default WelcomePage