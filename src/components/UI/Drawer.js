import React, { Component } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { withStyles } from "@material-ui/core";
import Subject from "../../utils/subject";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import styled from "styled-components";

const DrawerContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 64px 12px 0 12px;
  width: 400px;
  height: 100%;
`;

const styles = {
  menuButton: {
    position: "absolute",
    top: 0,
    right: 0
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
    const { classes, Content } = this.props;
    const { open } = this.state;
    return (
      <SwipeableDrawer
        open={open}
        onClose={this.toggleDrawer}
        onOpen={this.toggleDrawer}
      >
        <DrawerContentContainer>
          <IconButton
            className={classes.menuButton}
            onClick={this.toggleDrawer}
            color='inherit'
            aria-label='Menu'
          >
            <CloseIcon />
          </IconButton>
          <Content />
        </DrawerContentContainer>
      </SwipeableDrawer>
    );
  }
}

export default withStyles(styles)(Drawer);
