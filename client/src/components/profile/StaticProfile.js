import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import numeral from "numeral";
import Follow from "../../util/Follow";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
// Redux
import { connect } from "react-redux";
import { setProfile } from "../../redux/actions/dataActions";

const styles = theme => ({ ...theme.spreadThis });

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StaticProfile = ({
  setProfile,
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
    if (!prevCredentials || !prevCredentials.following) return;
    if (prevCredentials.following.length < credentials.following.length) {
      setProfile({ ...profile, followers: [...followers, credentials.handle] });
    } else if (
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
            <Tooltip title={followers.length}>
              <MuiLink
                component={Link}
                to={`/users/${handle}/followers`}
                style={{
                  marginRight: 20,
                  color: "unset",
                  textDecoration: "none"
                }}
              >
                <span className="follow-number">
                  {followers.length < 10000
                    ? followers.length
                    : numeral(followers.length).format("0.00a", Math.floor)}
                </span>{" "}
                <span>followers</span>
              </MuiLink>
            </Tooltip>
            <Tooltip title={following.length}>
              <MuiLink
                component={Link}
                to={`/users/${handle}/following`}
                style={{ color: "unset", textDecoration: "none" }}
              >
                <span className="follow-number">
                  {following.length < 10000
                    ? following.length
                    : numeral(following.length).format("0.00a", Math.floor)}
                </span>{" "}
                <span>following</span>
              </MuiLink>
            </Tooltip>
          </div>
        </div>
        {handle !== credentials.handle && <Follow profile={profile} />}
      </div>
    </Paper>
  );
};

StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  setProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { setProfile })(
  withStyles(styles)(StaticProfile)
);
