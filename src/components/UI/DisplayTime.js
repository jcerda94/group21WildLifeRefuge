import "react-dropdown/style.css";
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import "../../css/DisplayTime.css"


const Container = styled(Paper)`
  position: absolute;
  right: 0%;
  top: 8%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 6px;
`;



class DisplayTime extends Component {
    constructor (props) {
        super(props);
        this.state = {
            day: 0,
            week: 0,
            month: 0
        };
    }
    setSimulationTime(elapsedTime, simulationTime){
        this.setState({
            day: elapsedTime,
            week: (elapsedTime/7),
            month: elapsedTime/30
        })

    }
    getDay(){
        return this.state.day;

    }
    getWeek(){
        return this.state.week;
    }
    getMonth(){
        return this.state.month;
    }
    render () {
        const {day} = this.state;

        return (
            <Container>
                <div className="header">

                    <h2>Simulation Time</h2>
                    <div className="month" id="month">
                        <div className="time__content" id="month">
                            <div className="time__label">Months</div>
                            <div className="time__value" id="monthValue">{parseInt((day)/28)}</div>

                    </div>
                    <div className="time__content" id="week">
                        <div className="time__label">Weeks</div>
                        <div className="time__value" id="weekValue">{parseInt(this.getWeek() % 4)}</div>
                    </div>

                    <div className="time__content" id="day">
                        <div className="time__label">Days</div>
                        <div className="time__value" id="dayValue">
                            {parseInt(this.getDay()%7)}
                        </div>
                    </div>
                </div>
            </div>

            </Container>
        );
    }
}

export const getDisplayTime =()=>{
    return DisplayTime.instance || null;
}

export default function (container) {
    if(!DisplayTime.instance){
        DisplayTime.instance = new DisplayTime(container);
    }
    return DisplayTime.instance;
}