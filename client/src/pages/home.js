import React, { Component } from "react";
import Scream from "../components/scream/Scream";
import Profile from "../components/profile/Profile";
import PropTypes from "prop-types";
import ScreamSkeleton from "../components/util/ScreamSkeleton";
// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Redux
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

const styles = theme => ({ ...theme.spreadThis });

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
        <Typography variant="h5" className={classes.noData}>
          Follow Apes to see their screams!
        </Typography>
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
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ data: state.data });

export default connect(mapStateToProps, { getScreams })(
  withStyles(styles)(home)
);
