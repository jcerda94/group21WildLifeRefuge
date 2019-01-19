import React, { Component } from 'react';
import styled from 'styled-components';

const Line = styled.div`
  width: 1px;
  height: ${props => `${props.height}px`};
  background-color: ${props => props.color};
`

class VerticalLine extends Component {
  render () {
    const { height=50, color='white' } = this.props
    return <Line height={height} color={color} />
  }
}

export default VerticalLine;