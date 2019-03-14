import "react-dropdown/style.css";
import React, { Component } from "react";
import { getCapiInstance } from "../../utils/CAPI/capi";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import "./DisplayTime.css"


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

        this.simModel = getCapiInstance();
        this.state = {
            selected: 0
        };
    }

    _onSelect = option => {
        this.setState({ selected: option });

        const placeHolderValue =
            typeof this.state.selected === "string"
                ? this.state.selected
                : this.state.selected.label;

        this.simModel.setValue({ key: "answer", value: placeHolderValue });
    }

    render () {

        return (
            <Container>
                <div class="header">

                    <h2>Simulation Time</h2>
                    <div class="month" id="month">
                        <div class="time__content" id="month">
                            <div class="time__label">Months</div>
                            <div class="time__value" id="monthValue">1</div>

                    </div>
                    <div class="time__content" id="week">
                        <div class="time__label">Weeks</div>
                        <div class="time__value" id="weekValue">000</div>
                    </div>

                    <div class="time__content" id="day">
                        <div class="time__label">Days</div>
                        <div class="time__value" id="dayValue">
                          1000
                        </div>
                    </div>
                </div>
            </div>

            </Container>
        );
    }
}

export default DisplayTime;
