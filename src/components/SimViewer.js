import React, { Component } from 'react'
import Sim from './Sim'

class SimViewer extends Component {
  constructor () {
    super()

    this.state = {
      height: 0,
      width: 0
    }
    this.sim = new Sim()

    this.sim.animate()
    document.body.appendChild(this.sim.renderer.domElement)
  }

  animate = () => {
    this.sim.animate()
  }

  componentDidUpdate () {
    const { height } = this.props
    console.log(height)

    this.sim.renderer.setSize(window.innerWidth, height)
  }

  render () {
    return <div style={this.props.style} />
  }
}

export default SimViewer
