import React, { Component } from "react";
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

class user extends Component {
  state = { screamIdParam: null };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;
    if (screamId) this.setState({ screamIdParam: screamId });
    this.props.getUserData(handle);
  }

  componentDidUpdate(prevProps) {
    const prevScreamId = prevProps.match.params.screamId;
    const screamId = this.props.match.params.screamId;
    const handle = this.props.match.params.handle;
    const prevHandle = prevProps.match.params.handle;
    if (prevScreamId !== screamId) {
      this.props.setProfile(null);
      this.setState({ screamIdParam: screamId });
      this.props.getUserData(handle);
    } else if (prevHandle !== handle) {
      this.props.setProfile(null);
      this.props.getUserData(handle);
    }
  }

  render() {
    const { screams, loading, profile } = this.props.data;
    const { screamIdParam } = this.state;
    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : screams === null ? (
      <p>No screams from this user</p>
    ) : !screamIdParam ? (
      screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      screams.map(scream => {
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
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  setProfile: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ data: state.data });

const mapActionsToProps = { getUserData, setProfile };

export default connect(mapStateToProps, mapActionsToProps)(user);
