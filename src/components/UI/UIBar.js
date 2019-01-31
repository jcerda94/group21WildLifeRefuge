import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";


const styles = {
  root: {
    flexGrow: 3
  },
  grow: {
    flexGrow: 3
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};
function UIBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Willapa Refuge
          </Typography>
          <Button color="inherit">Add Predator</Button>
          <Button color="inherit">Remove Predator</Button>
          <Button color="inherit">Add Prey</Button>
          <Button color="inherit">Remove Prey</Button>
          <Button color="inherit">Add Trees</Button>
          <Button color="inherit">Remove Trees</Button>
          <Button color="inherit">Add Bushes</Button>
          <Button color="inherit">Remove Bushes</Button>
          <Button color="inherit">Add Grasses</Button>
          <Button color="inherit">Remove Grasses</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

UIBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UIBar);

