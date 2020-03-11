import React, { Component } from "react";
import Scream from "../components/scream/Scream";
import Profile from "../components/profile/Profile";
import PropTypes from "prop-types";
import ScreamSkeleton from "../util/ScreamSkeleton";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// Redux
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

const styles = {
  noScreams: {
    fontSize: 30,
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.6)"
  }
};

export class home extends Component {
  componentDidMount() {
    this.props.getScreams();
  }

  render() {
    const { classes } = this.props;
    const { screams, loading } = this.props.data;
    let recentScreamsMarkup = !loading ? (
      screams && screams.length > 0 ? (
        screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
      ) : (
        <p className={classes.noScreams}>Follow Apes to see their screams!</p>
      )
    ) : (
      <ScreamSkeleton />
    );
    return (
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ data: state.data });

export default connect(mapStateToProps, { getScreams })(
  withStyles(styles)(home)
);
