import React, { Component } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { withStyles } from "@material-ui/core";
import Subject from "../../utils/subject";

const styles = {
  list: {
    width: 250
  }
};

class Drawer extends Component {
  state = {
    open: false
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
            {" "}
            <div
              tabIndex={0}
              role='button'
              onClick={this.toggleDrawer}
              onKeyDown={this.toggleDrawer}
            />
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export default withStyles(styles)(Drawer);
