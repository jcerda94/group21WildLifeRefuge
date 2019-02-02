import React from "react";
import "../../css/welcome.css";
import LessonName from "./LessonName";
import Steps from "./Steps";
import Header from "./Header";
import styled from "styled-components";
import Title from "./Title";
import User from "../../js/User";
import Summary from "./Summary";
import VerticalLine from "./VerticalLine";
import Button from "../Styled/Button";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: #000000aa;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('assets/willapa-wildlife-refuge-hiking.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

class WelcomePage extends React.Component {
  goToSim = () => {
    const { history } = this.props;
    history && history.push("/sim");
  }
  render () {
    const { handleLogin, name } = this.props;
    return (
      <React.Fragment>
        <Background />
        <Container>
          <Header name={name} />
          <Title title='Welcome to Willapa Wildlife Refuge' />
          <VerticalLine height={80} color='white' />
          <LessonName name='What do animals do in their free time?' />
          <VerticalLine height={360} color='white' />
          <Steps
            steps={[
              "Add animals",
              "Observe their interactions",
              "Watch as hawks dominate the ecosystem",
              "More steps to come"
            ]}
          />
          <Button
            label='Start Lesson'
            onClick={this.goToSim}
            color='#4CAF50'
            hoverColor='#FFFFFF'
            labelColor='#FFFFFF'
            labelHoverColor='#4CAF50'
          />
          <Summary summary='This is the summary paragraph from ReactJS' />
        </Container>
      </React.Fragment>
    );
  }
}

export default WelcomePage;
