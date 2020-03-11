import React, { Component } from "react";
import PropTypes from "prop-types";
import ProfilesDisplay from "../util/ProfilesDisplay";
// Redux
import { connect } from "react-redux";
import {
  getFollowUsers,
  setFollowers,
  setFollowing
} from "../redux/actions/dataActions";

export class follows extends Component {
  state = { followType: "" };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    let type;
    if (this.props.match.path.includes("followers")) type = "followers";
    else if (this.props.match.path.includes("following")) type = "following";
    this.setState({ followType: type });
    this.props.getFollowUsers(handle, type);
  }

  componentWillUnmount() {
    setFollowers(null);
    setFollowing(null);
  }

  render() {
    const {
      followersDetails,
      followingUsersDetails,
      loading
    } = this.props.data;
    const { followType } = this.state;
    const usersToDisplay =
      followType === "followers" ? followersDetails : followingUsersDetails;
    return <ProfilesDisplay users={usersToDisplay} loading={loading} />;
  }
}

follows.propTypes = {
  getFollowUsers: PropTypes.func.isRequired,
  setFollowers: PropTypes.func.isRequired,
  setFollowing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ data: state.data });

const mapActionsToProps = { getFollowUsers, setFollowers, setFollowing };

export default connect(mapStateToProps, mapActionsToProps)(follows);
