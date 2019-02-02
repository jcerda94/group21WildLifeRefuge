import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";

class ModelMenu extends Component {
  render () {
    const { anchor, open, onClose, children } = this.props;
    return (
      <Menu
        id='menu-appbar'
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        onClose={onClose}
      >
        {React.Children.map(children, child =>
          React.cloneElement(child, { ...child.props, onClose })
        )}
      </Menu>
    );
  }
}

export default ModelMenu;
