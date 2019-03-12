import React, { Component } from "react";
import styled from "styled-components";
import ThreeEntry from "../scenes/ThreeEntry";
import { getSceneManager } from "../scenes/SceneManager";
import { getCapiInstance } from "../utils/CAPI/capi";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddMenu from "./UI/AddMenu";

const CanvasContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  }
});

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
    return (
      <CanvasContainer ref={this.canvasContainer}>
        <AddMenu />
      </CanvasContainer>
    );
  }
}

SimViewer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimViewer);
