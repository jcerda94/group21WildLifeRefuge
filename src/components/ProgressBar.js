import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

`

const Overall = styled.div`
    padding: 0.01em 16px;
    color: #000;
    background-color: #f1f1f1;
    border-radius: 16px;    
`

const Progress = styled.div`
    padding: 0.01em 16px;
    color:#fff;
    background-color:#2196F3;
    border-radius: 16px;
`

class ProgressBar extends Component {
    render () {
        const { progress } = this.props

        return (
            <Container>
            <Overall>
            <Progress>{progress}</Progress>
            </Overall>
            </Container>
    )
    }
}

export default ProgressBar;