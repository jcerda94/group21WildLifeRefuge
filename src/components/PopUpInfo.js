import React from "react";
import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";

const hare = (
  <div>
    <strong>Snowshoe hare:</strong> <br />
    <strong>Description: </strong>
    Unlike most snowshoe hares, the fur of those that inhabit the coast of
    Washington
    <br />
    and Oregon do not change white in the winter. Snowshoe hares can be
    identified by their <br />
    large hind feet and the black ear tips.
  </div>
);
const tree = (
  <div>
    <strong>Western Red Cedar:</strong> <br />
    <strong>Description: </strong>
    The Western Red Cedar is very commonly found in the wild in the northwestern
    United States and Canada.
  </div>
);

const hawk = (
  <div>
    <strong>Red tailed hawk:</strong> <br />
    <strong>Description: </strong>
    Red-tailed Hawks are large, sharp-taloned birds <br />
    that can be aggressive when defending nests or territories.
    <br />
    They frequently chase off other hawks, eagles, and Great Horned Owls.<br/>

  </div>
);

const bush = (
  <div>
    <strong>Big SageBrush:</strong> <br />
    <strong>Description: </strong>
    Big sagebrush and its subspecies, are tall, rounded, U.S. native shrubs
    <br />
    with short branched, woody trunks. The height is normally about 4 feet, but
    varies from 2 feet <br />
    in arid conditions to as high as 15 feet on favorable sites.
  </div>
);
const grass = (
  <div>
    <strong>Bluebunch Wheatgrass:</strong> <br />
    <strong>Description: </strong>
    Bluebunch Wheatgrass is a perennial bunchgrass common to the northern Great
    Plains
    <br /> and the Intermountain regions of the western United States.
  </div>
);

class PopUpInfo extends React.Component {
  state = {
    anchorEl: null,
    displayInfo: "default"
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  }

  popUpInfo (name,gender, event) {
    if (name === "hare") {
      this.setState({
        info: hare,
        gender: gender,
        anchorEl: event.currentTarget
      });
    } else if (name === "redtailHawk") {
      this.setState({
        info: hawk,
        gender: gender,
        anchorEl: event.currentTarget
      });
    } else if (name === "bush") {
      this.setState({
        info: bush,
        gender: gender,
        anchorEl: event.currentTarget
      });
    } else if (name === "grass" || name === "LowPolyGrass") {
      this.setState({
        info: grass,
        gender: gender,
        anchorEl: event.currentTarget
      });
    } else if (name === "tree") {
      this.setState({
        info: tree,
        gender: gender,
        anchorEl: event.currentTarget
      });
    }
  }

  render () {
    const { anchorEl } = this.state;
    const { info } = this.state;
    const {gender} = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <Popover
          id='simple-popper'
          open={open}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          {info}
          <div>  <strong>Gender: </strong>{gender}</div>
        </Popover>
      </div>
    );
  }
}

PopUpInfo.propTypes = {
  classes: PropTypes.object.isRequired
};

export const getPopUpInfo = () => {
  return PopUpInfo.instance || null;
};

export default function (container) {
  if (!PopUpInfo.instance) {
    PopUpInfo.instance = new PopUpInfo(container);
  }
  return PopUpInfo.instance;
}
