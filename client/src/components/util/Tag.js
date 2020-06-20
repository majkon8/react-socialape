import React from "react";
import PropTypes from "prop-types";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

const styles = {
  tagButton: {
    background: "white",
    "&:hover": { background: "white" },
    display: "inline",
    marginRight: 5,
    marginBottom: 15,
    position: "relative",
    top: 4,
  },
};

const Tag = ({ tagName, classes, removeTag }) => (
  <Tooltip title="Click to remove tag">
    <Button
      className={classes.tagButton}
      onClick={() => removeTag(tagName)}
      variant="contained"
      style={{ textTransform: "none" }}
    >
      {tagName}
    </Button>
  </Tooltip>
);

Tag.propTypes = {
  tagName: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  removeTag: PropTypes.func.isRequired,
};

export default withStyles(styles)(Tag);
