import React, { Component } from "react";
import PropTypes from "prop-types";
// MUI
import MuiSwitch from "@material-ui/core/Switch";
import withStyles from "@material-ui/core/styles/withStyles";

const CustomSwitch = withStyles({
  switchBase: {
    color: "#00bcd4",
    "&$checked": { color: "#d84315" },
    "&$checked + $track": { backgroundColor: "#d84315" },
    $track: { backgroundColor: "#00bcd4" }
  },
  checked: {},
  track: { backgroundColor: "#00bcd4" }
})(MuiSwitch);

export class Switch extends Component {
  render() {
    const { searchForUsers, handleChange } = this.props;
    return (
      <>
        <label>Screams</label>
        <CustomSwitch checked={searchForUsers} onChange={handleChange} />
        <label>Users</label>
      </>
    );
  }
}

Switch.propTypes = {
  handleChange: PropTypes.func.isRequired,
  searchForUsers: PropTypes.bool.isRequired
};

export default Switch;
