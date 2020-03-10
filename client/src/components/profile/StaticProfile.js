import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import numeral from "numeral";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
// Redux
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/dataActions";
import { follow, unfollow } from "../../redux/actions/userActions";

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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StaticProfile = ({
  setProfile,
  follow,
  unfollow,
  classes,
  profile,
  profile: {
    handle,
    createdAt,
    imageUrl,
    bio,
    website,
    location,
    followers,
    following
  },
  user: { credentials }
}) => {
  const prevCredentials = usePrevious(credentials);

  useEffect(() => {
    if (
      prevCredentials &&
      prevCredentials.following.length < credentials.following.length
    ) {
      setProfile({ ...profile, followers: [...followers, credentials.handle] });
    } else if (
      prevCredentials &&
      prevCredentials.following.length > credentials.following.length
    ) {
      const updatedFollowers = [...followers].filter(
        handle => handle !== credentials.handle
      );
      setProfile({ ...profile, followers: [...updatedFollowers] });
    }
  }, [credentials]);

  useEffect(() => {
    return () => {
      setProfile(null);
    };
  }, []);

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

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} className="profile-image" alt="profile" />
        </div>
        <hr />
        <div className="profile-handle">
          <MuiLink
            component={Link}
            to={`/users/${handle}`}
            color="primary"
            variant="h5"
          >
            @{handle}
          </MuiLink>
        </div>
        <hr />
        <div className="profile-details">
          {bio && <Typography variant="body2">{bio}</Typography>}
          <hr />
          {location && (
            <>
              <LocationOn color="primary" />
              <span>{location}</span>
              <hr />
            </>
          )}
          {website && (
            <>
              <LinkIcon color="primary" />
              <a href={website} target="_blank" rel="noopener noreferrer">
                {" "}
                {website}
              </a>
              <hr />
            </>
          )}
          <CalendarToday color="primary" />{" "}
          <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
          <hr />
          <div>
            <span style={{ marginRight: 20 }}>
              <span className="follow-number">
                {followers.length < 10000
                  ? followers.length
                  : numeral(followers.length).format("0.00a", Math.floor)}
              </span>{" "}
              <span>followers</span>
            </span>
            <span>
              <span className="follow-number">
                {following.length < 10000
                  ? following.length
                  : numeral(following.length).format("0.00a", Math.floor)}
              </span>{" "}
              <span>following</span>
            </span>
          </div>
        </div>
        {followButton}
      </div>
    </Paper>
  );
};

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  setProfile: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ user: state.user });

const mapActionsToProps = { setProfile, follow, unfollow };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(StaticProfile));
