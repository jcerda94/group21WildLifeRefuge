import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { getSceneManager } from '../scenes/SceneManager';
import {getValue} from "../utils/helpers";

const styles = theme => ({
    typography: {
        margin: theme.spacing.unit * 2,
    },
});

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    state = {
        anchorEl: null,
    };



    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
        });

        const vector = this.convertClickToVector(event);
        this.raycaster.set(this.camera.position, vector);
        const intersects =
            this.raycaster.intersectObjects(this.scene.children, true) || [];

        const model = intersects[0] || {};
        const isSelectable = !!getValue("object.userData.selectable", model);

        if (isSelectable) {
            console.log("Model.object" + model.object.material.color.getHexString());
            console.log("Model.object" + model.object.name);
            this.toggleSelected(model.object);

        }
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };
    checkIntersects = () => {
        const intersects =
            this.raycaster.intersectObjects(this.scene.children, true) || [];

        if (intersects.length > 0) {
            if (this.intersected !== intersects[0].object) {
                this.resetIntersectedColor(this.intersected);
                this.intersected = getValue("object", intersects[0]);

                const selectable = getValue("userData.selectable", this.intersected);
                if (selectable) {
                    const highlight = getValue(
                        "userData.color.highlight",
                        this.intersected
                    );
                    const color = getValue("material.color", this.intersected);
                    color.set && color.set(highlight);
                }
            }
        } else {
            this.resetIntersectedColor(this.intersected);
            this.intersected = null;
        }
    }


    render() {
        const SceneManager = getSceneManager();
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div>
                <Button
                    aria-owns={open ? 'simple-popper' : undefined}
                    aria-haspopup="true"
                    variant="contained"
                    onClick={this.handleClick}
                >
                    Open Popover
                </Button>
                <Popover
                    id="simple-popper"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography className={classes.typography}>The content of the Popover.</Typography>
                </Popover>
            </div>
        );
    }
}

PopUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PopUp);