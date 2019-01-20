import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px 14px 24px;
  border-radius: 0.25em;
  cursor: pointer;
  user-select: none;

  background-color: ${props => props.color};
  transition: background-color .5s;

  &:hover {
    background-color: ${props => props.hoverColor};
  }
`

const Label = styled.span`
  color: ${props => props.labelColor};
  transition: color .5s;
  font-size: 19px;

  ${Container}:hover & {
    color: ${props => props.labelHoverColor};
  }
`

class Button extends Component {
  onClick = () => {
    const { onClick } = this.props

    onClick && onClick()
  }

  render() {
    const { label, color, hoverColor, labelColor, labelHoverColor } = this.props
    return (
      <Container
        color={color}
        hoverColor={hoverColor}
      >
        <Label 
          labelColor={labelColor} 
          labelHoverColor={labelHoverColor}
        >
          {label}
        </Label>
      </Container>
    )
  }
}

Button.defaultProps = {
  color: 'black',
  labelColor: 'white',
  hoverColor: 'white',
  labelHoverColor: 'black'
}

export default Button;