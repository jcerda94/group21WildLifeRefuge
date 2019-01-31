import React, { Component } from "react";
import ElementButton from "./ElementButton";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/core/Menu";

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
            <MenuIcon />
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

/*
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  background-color: #303030;
`;

class UIBar extends Component {
  render () {
    return (
      <Container>
        <ElementButton
          model='tree'
          key='rC'
          addText='Add Tree'
          title='Western Red Cedar'
          increment={this.props.increment}
          name='redCedar'
        />
         <ElementButton model="remove tree" key="rmC" addText="Remove Tree" title="Western Red Cedar" 
                increment={this.props.increment} name="redCedar"/>;
        <ElementButton
          model='hawk'
          key='rH'
          addText='Add Predator'
          title='Red Tailed Hawk'
          increment={this.props.increment}
          name='redHawk'
        />
        <ElementButton model="remove hawk" key="rmH" addText="Remove Hawk" title="Red Tailed Hawk" 
                increment={this.props.increment} name="redCedar"/>;
                
        <ElementButton
          model='hare'
          key='sH'
          addText='Add Prey'
          title='Snowshoe Hare'
          increment={this.props.increment}
          name='snowHare'
        />
        <ElementButton model="Remove hare" key="rmH" addText="Remove Prey" title="Snowshoe Hare" 
                increment={this.props.increment} name="snowHare"/>;
                
        <ElementButton
          model='bush'
          key='bS'
          addText='Add Bushes'
          title='Big Sagebrush'
          increment={this.props.increment}
          name='bigSage'
        />
        <ElementButton model="Remove bush" key="rmBS" addText="Remove Bushes" title="Big Sagebrush" 
                increment={this.props.increment} name="bigSage"/>;
        <ElementButton model="wheatgrass" key = "bW" addText= "Add Wheatgrass" title="BlueBunch Wheatgrass" 
                increment={this.props.increment} name="blueBunch"/>;
        <ElementButton model="Remove wheatgrass" key = "rmBW" addText= "Remove Wheatgrass" 
                title="BlueBunch Wheatgrass" increment={this.props.increment} name="blueBunch"/>;
            
      </Container>
    );
  }
}
*/
//export default UIBar;
