import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import styled from "styled-components";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {styles as SimViewer} from "@material-ui/core/es/Button/Button";

const Container = styled.div`
 position: absolute;
 left: 45%;
 top: 90%;
 display: flex;
 grid-template-columns: auto, auto, auto;
 justify-content: center;
`;

const DivMargin = styled.div`
  margin: 5px;
`;


class AddMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });

    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <Container>
                    <DivMargin>
                        <Fab
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            color="primary" aria-label="Add" className={SimViewer.fab}>
                            <AddIcon />
                        </Fab>
                    </DivMargin>
                    <DivMargin>
                        <Fab color = "secondary" aria-label="Delete" className={SimViewer.fab}>
                            <DeleteIcon />
                        </Fab>
                    </DivMargin>
                </Container>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose}>Hare</MenuItem>
                    <MenuItem onClick={this.handleClose}>HawK</MenuItem>
                    <MenuItem onClick={this.handleClose}>Tree</MenuItem>
                    <MenuItem onClick={this.handleClose}>Grass</MenuItem>
                    <MenuItem onClick={this.handleClose}>Bush</MenuItem>

                </Menu>
            </div>
        );
    }
}

export default AddMenu;
