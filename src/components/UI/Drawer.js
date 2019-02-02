import React, { Component } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { withStyles } from "@material-ui/core";
import Subject from "../../utils/subject";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { relative } from "path";

const styles = {
  list: {
    width: 250
  },
  menuButton: {
    position: "absolute",
    top: 0,
    right: 0
  }
};

class Drawer extends Component {
  state = {
    open: true
  }

  setDrawer = ({ to: value }) => {
    const { open } = this.state;
    if (open !== Boolean(value)) {
      this.setState({ open: value });
    }
  }

  toggleDrawer = () => {
    const { open } = this.state;
    this.setDrawer({ to: !open });
  }

  componentDidMount () {
    const { open } = this.state;
    Subject.subscribe("toggle left", this.toggleDrawer);
  }

  componentWillUnmount () {
    Subject.unsubscribe("toggle left", this.toggleDrawer);
  }

  render () {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.list}>
        <SwipeableDrawer
          open={open}
          onClose={this.toggleDrawer}
          onOpen={this.toggleDrawer}
        >
          <div style={{ width: "400px", height: "100%" }}>
            <IconButton
              className={classes.menuButton}
              onClick={this.toggleDrawer}
              color='inherit'
              aria-label='Menu'
            >
              <CloseIcon />
            </IconButton>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export default withStyles(styles)(Drawer);
