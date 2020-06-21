import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Scream from "../components/scream/Scream";
import StaticProfile from "../components/profile/StaticProfile";
import ScreamSkeleton from "../components/util/ScreamSkeleton";
import ProfileSkeleton from "../components/util/ProfileSkeleton";
// MUI
import Grid from "@material-ui/core/Grid";
// Redux
import { connect } from "react-redux";
import { getUserData, setProfile } from "../redux/actions/dataActions";

function User({
  match,
  getUserData,
  setProfile,
  data: { screams, loading, profile },
}) {
  const [screamIdParam, setScreamIdParam] = useState(null);

  useEffect(() => {
    const screamId = match.params.screamId;
    const handle = match.params.handle;
    setProfile(null);
    if (screamId) setScreamIdParam(screamId);
    getUserData(handle);
  }, [match.params.screamId, match.params.handle]);

  const screamsMarkup = loading ? (
    <ScreamSkeleton />
  ) : screams === null ? (
    <p>No screams from this user</p>
  ) : !screamIdParam ? (
    screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    screams.map((scream) => {
      if (scream.screamId !== screamIdParam)
        return <Scream key={scream.screamId} scream={scream} />;
      return <Scream key={scream.screamId} scream={scream} openDialog />;
    })
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={4} xs={12}>
        {profile === null ? (
          <ProfileSkeleton />
        ) : (
          <StaticProfile profile={profile} />
        )}
      </Grid>
      <Grid item sm={8} xs={12}>
        {screamsMarkup}
      </Grid>
    </Grid>
  );
}

User.propTypes = {
  getUserData: PropTypes.func.isRequired,
  setProfile: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ data: state.data });

const mapActionsToProps = { getUserData, setProfile };

export default connect(mapStateToProps, mapActionsToProps)(User);
