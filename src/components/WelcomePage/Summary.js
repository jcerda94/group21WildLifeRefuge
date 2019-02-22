import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    `;

const Text = styled.p`
    color = #FFFFFF;
    font-size: 14px;
`;

class Summary extends Component {
    render () {
        const { summary } = this.props;

        return (
            <Container>
                <Text>{summary}</Text>
            </Container>
        );
    }
}

export default Summary;