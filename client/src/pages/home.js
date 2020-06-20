import React, { useEffect } from "react";
import Profile from "../components/profile/Profile";
import PropTypes from "prop-types";
import ScreamsDisplay from "../components/util/ScreamsDisplay";
// MUI
import Grid from "@material-ui/core/Grid";
// Redux
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

function Home({ getScreams, data }) {
  useEffect(() => {
    getScreams();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
      <Grid item sm={8} xs={12}>
        <ScreamsDisplay loading={data.loading} screams={data.screams} />
      </Grid>
    </Grid>
  );
}

Home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ data: state.data });

export default connect(mapStateToProps, { getScreams })(Home);
