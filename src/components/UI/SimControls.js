import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import PlayArrow from "@material-ui/icons/PlayArrow";
import PauseBars from "@material-ui/icons/Pause";
import Subject from "../../utils/subject";

const Pause = props => {
  return <PauseBars {...props} />;
};

const Play = props => {
  return <PlayArrow {...props} />;
};

class SimControls extends Component {
  state = {
    paused: false
  }

  toggleSim = () => {
    if (this.state.paused) {
      Subject.next("resume_simulation");
    } else {
      Subject.next("pause_simulation");
    }
  }

  updateButton = ({ paused }) => () => {
    if (this.state.paused !== paused) {
      this.setState({ paused });
    }
  }

  componentDidMount () {
    Subject.subscribe("simulation_paused", this.updateButton({ paused: true }));
    Subject.subscribe(
      "simulation_resumed",
      this.updateButton({ paused: false })
    );
  }

  render () {
    const { paused } = this.state;
    return (
      <IconButton
        color={this.props.color}
        className={this.props.className}
        onClick={this.toggleSim}
      >
        {paused ? <PlayArrow /> : <PauseBars />}
      </IconButton>
    );
  }
}

export default SimControls;
