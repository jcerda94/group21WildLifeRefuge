import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";

class ModelAdd extends Component {
  onClick = () => {
    const { onClick, onClose } = this.props;

    onClick && onClick();
    onClose && onClose();
  }

  render () {
    const { label } = this.props;
    return <MenuItem onClick={this.onClick}>{label}</MenuItem>;
  }
}

export default ModelAdd;
