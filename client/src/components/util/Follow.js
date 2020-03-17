import React from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { follow, unfollow } from "../../redux/actions/userActions";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  ...theme.spreadThis,
  followButton: {
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    fontWeight: "bold",
    fontSize: 14
  }
});

const Follow = ({
  follow,
  unfollow,
  classes,
  user: { credentials },
  profile: { handle }
}) => {
  const handleFollow = () => follow(handle);

  const handleUnfollow = () => unfollow(handle);

  const followButton =
    credentials.following && credentials.following.includes(handle) ? (
      <Button
        onClick={handleUnfollow}
        variant="contained"
        color="primary"
        className={`${classes.button} ${classes.followButton}`}
      >
        Following
      </Button>
    ) : (
      <Button
        onClick={handleFollow}
        variant="contained"
        className={`${classes.button} ${classes.followButton}`}
      >
        Follow me
      </Button>
    );

  return followButton;
};

Follow.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ user: state.user });

const mapActionsToProps = { follow, unfollow };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Follow));
