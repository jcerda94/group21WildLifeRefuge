import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { getSceneManager } from '../scenes/SceneManager';
import {getValue} from "../utils/helpers";
import styled from "styled-components";

const hawkInfo = "You seclect a hawk";
const Container = styled.div`

  position: absolute;
  right: 2%;
  top: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #67F07F;   
  width: 15%:;
  text-align: center;
`;


const styles = theme => ({
    typography: {
        margin: theme.spacing.unit * 2,
    },
});

class PopUp extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          shown: false,
      }

  }

    popUpWindow(name){
        this.setState({
            shown: true,
            name: name,
        });
    }
    handleClick = event => {
        this.setState({
            shown: false,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    render() {


        const {shown} = this.state;
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const {name} = this.state;
        if(shown ==false){
            return null;
        }
        return (
            <Container>


            <div>
            <p> {hawkInfo}</p>
            </div>
                <Button
                    aria-owns={open ? 'simple-popper' : undefined}
                    aria-haspopup="true"
                    variant="contained"
                    onClick={this.handleClick}
                >
                    Close
                </Button>

            </Container>
        );
    }
}

PopUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

//export default withStyles(styles)(PopUp);


export const getPopUpWindow = () => {
    return PopUp.instance || null;
};

export default function (container) {
    if (!PopUp.instance) {
        PopUp.instance = new PopUp(container);
    }
    return PopUp.instance;
}


