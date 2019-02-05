import React, { Component } from "react";
import styled from "styled-components";
import ThreeEntry from "../scenes/ThreeEntry";
import { getSceneManager } from "../scenes/SceneManager";
import { getCapiInstance } from "../utils/CAPI/capi";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

const CanvasContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
});

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

class SimViewer extends Component {
  canvasContainer = React.createRef()

  componentDidMount () {
    this.sceneManager = new ThreeEntry(
      this.canvasContainer.current
    ).sceneManager;

    const capi = getCapiInstance();
    const Transporter = capi.getTransporter();
    Transporter.addInitialSetupCompleteListener(() => {
      getSceneManager().onTransporterReady();
    });
    Transporter.notifyOnReady();
  }

  onClick = () => {
    this.sceneManager.resetCamera();
  }

  render () {
    return <CanvasContainer ref={this.canvasContainer}>
      <Container>
        <DivMargin> 
          <Fab color="primary" aria-label="Add" className={SimViewer.fab}>
          <AddIcon />
          </Fab>
        </DivMargin>
        <DivMargin>
          <Fab color = "secondary" aria-label="Delete" className={SimViewer.fab}>
          <DeleteIcon />
          </Fab>
        </DivMargin>
      </Container>
    </CanvasContainer>
    ;
  }
}

SimViewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimViewer);
