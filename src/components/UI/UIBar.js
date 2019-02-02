import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ModelAdd from "./ModelAdd";
import ModelMenu from "./ModelMenu";

const styles = {
  root: {
    zIndex: 10
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class UIBar extends Component {
  state = {
    floraAnchor: null,
    faunaAnchor: null
  }

  handleMenu = anchor => event => {
    if (event.currentTarget !== this.state[anchor]) {
      this.setState({ [anchor]: event.currentTarget });
    }
  }

  handleClose = anchor => () => {
    if (this.state[anchor]) {
      this.setState({ [anchor]: null });
    }
  }

  render () {
    const { classes } = this.props;
    const { floraAnchor, faunaAnchor } = this.state;
    const floraOpen = Boolean(floraAnchor);
    const faunaOpen = Boolean(faunaAnchor);

    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' color='inherit' className={classes.grow}>
              Willapa Refuge
            </Typography>{" "}
            <Button onClick={this.handleMenu("floraAnchor")} color='inherit'>
              Flora
            </Button>
            <Button onClick={this.handleMenu("faunaAnchor")} color='inherit'>
              Fauna
            </Button>
            <ModelMenu
              id='menu-fauna'
              anchor={faunaAnchor}
              open={faunaOpen}
              onClose={this.handleClose("faunaAnchor")}
            >
              <ModelAdd label='Redtail Hawk' />
              <ModelAdd label='Snowshoe Hare' />
            </ModelMenu>
            <ModelMenu
              id='menu-flora'
              anchor={floraAnchor}
              open={floraOpen}
              onClose={this.handleClose("floraAnchor")}
            >
              <ModelAdd label='Big Sagebush' />
              <ModelAdd label='Western Cedar' />
            </ModelMenu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

UIBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UIBar);
