import React, { Component } from "react";
import styled, {keyframes} from "styled-components";

const flipAnimation = keyframes`
  0% { 
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg) 
  } 50% { 
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg) 
  } 100% { 
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  background-color: white;

  margin: 100px auto;
  -webkit-animation: ${flipAnimation} 1.2s infinite ease-in-out;
  animation: ${flipAnimation} 1.2s infinite ease-in-out;
`

class Loading extends Component {
  render () {
    return <Spinner/>
  }
}

export default Loading;