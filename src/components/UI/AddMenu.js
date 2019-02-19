import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import styled from "styled-components";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { styles as SimViewer } from "@material-ui/core/es/Button/Button";
import AddModels from "../../scenes/AddModels";
import RemoveModels from "../../scenes/RemoveModels";

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

  constructor (props) {
    super(props);
  }
  state = {
    anchorEl: null,
    doingRemove: false
  }

  componentDidMount () {}

  handleClick = event => {
    // console.log("handleClick  clicked for " + event.nativeEvent.target.outerText);
    this.setState({ anchorEl: event.currentTarget });
    this.setState({ doingRemove: false });
  }

  handleClickRemove = event => {
    // console.log("handleClickRemove clicked for " + event.nativeEvent.target.outerText);
    this.setState({ anchorEl: event.currentTarget });
    this.setState({ doingRemove: true });
  }

  handleClose = (add) => ev => {
    if (!this.state.doingRemove) {
      // console.log("Doing Add for " + ev.nativeEvent.target.outerText);
      //const model = ev.nativeEvent.target.outerText;
      //var str = model;
      //onDayChange = (date) => (event) => { ...your code }

      //<MenuItem onClick={onDayChange('2 days past')}>2 Days past</MenuItem>

     // str = str.slice(0, -1); // "12345.0"
      // console.log("Doing Add:  str: '" + str + "'");
      new AddModels(add);
    } else {
      // console.log("Doing Remove: for " + ev.nativeEvent.target.outerText);
      //const model = ev.nativeEvent.target.outerText;
      //var str = model;

      // console.log("Doing Remove:  str: '" + str + "'");
      // str = str.slice(0, -1); // "12345.0"
      // console.log("Doing Remove:  str: '" + str + "'");
      new RemoveModels(add);

    }
    this.setState({ anchorEl: null });
  }

  render () {
    const tree = "tree";
    const { anchorEl } = this.state;
    // console.log("AddMenu render:");

    return (
      <div>
        <Container>
          <DivMargin>
            <Fab
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup='true'
              onClick={this.handleClick} // in here set the "what we doing" flag
              color='primary'
              aria-label='Add'
              className={SimViewer.fab}
            >
              <AddIcon />
            </Fab>
          </DivMargin>
          <DivMargin>
            <Fab
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup='true'
              onClick={this.handleClickRemove} // in here set the "what we doing" flag
              color='secondary'
              aria-label='Delete'
              className={SimViewer.fab}
            >
              <DeleteIcon />
            </Fab>
          </DivMargin>
        </Container>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleClose("tree")}>tree</MenuItem>
          <MenuItem onClick={this.handleClose("hawk")}>hawk</MenuItem>
          <MenuItem onClick={this.handleClose("hare")}>hare</MenuItem>
          <MenuItem onClick={this.handleClose("grass")}>grass</MenuItem>
          <MenuItem onClick={this.handleClose("bush")}>bush</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default AddMenu;
