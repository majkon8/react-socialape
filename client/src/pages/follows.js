import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ProfilesDisplay from "../components/util/ProfilesDisplay";
// Redux
import { connect } from "react-redux";
import {
  getFollowUsers,
  setFollowers,
  setFollowing,
} from "../redux/actions/dataActions";

function Follows({ match, getFollowUsers, setFollowers, setFollowing, data }) {
  const [type, setType] = useState("");

  useEffect(() => {
    const handle = match.params.handle;
    let currentType;
    if (match.path.includes("followers")) currentType = "followers";
    else if (match.path.includes("following")) currentType = "following";
    setType(currentType);
    getFollowUsers(handle, currentType);
    return () => {
      setFollowers(null);
      setFollowing(null);
    };
  }, [match.params.handle]);

  const usersToDisplay =
    type === "followers" ? data.followersDetails : data.followingUsersDetails;

  return <ProfilesDisplay users={usersToDisplay} loading={data.loading} />;
}

Follows.propTypes = {
  setFollowUsers: PropTypes.func.isRequired,
  setFollowers: PropTypes.func.isRequired,
  setFollowing: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ data: state.data });

const mapActionsToProps = { getFollowUsers, setFollowers, setFollowing };

export default connect(mapStateToProps, mapActionsToProps)(Follows);
