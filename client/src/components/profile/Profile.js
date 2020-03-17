import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
import ProfileSkeleton from "../util/ProfileSkeleton";
import numeral from "numeral";
// MUI
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/link";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
// Redux
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const styles = theme => ({ ...theme.spreadThis });

export class Profile extends Component {
  handleLogout = () => this.props.logoutUser();

  render() {
    const {
      classes,
      user: {
        credentials: {
          handle,
          createdAt,
          imageUrl,
          bio,
          website,
          location,
          followers,
          following
        },
        loading
      }
    } = this.props;
    let profileMarkup = !loading ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <EditDetails />
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
        </div>
      </Paper>
    ) : (
      <ProfileSkeleton />
    );
    return profileMarkup;
  }
}

const mapStateToProps = state => ({ user: state.user });

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { logoutUser })(
  withStyles(styles)(Profile)
);
