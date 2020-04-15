import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/icon.png";
// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// Redux
import { connect } from "react-redux";
import { sendPasswordResetEmail } from "../redux/actions/userActions";
import { clearErrors, clearSuccesses } from "../redux/actions/uiActions";

const styles = (theme) => ({ ...theme.spreadThis });

export class forgotPassword extends Component {
  state = { email: "" };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.UI.errors) return { errors: nextProps.UI.errors };
    return null;
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.sendPasswordResetEmail({ email: this.state.email });
  };

  render() {
    const {
      classes,
      UI: { loading, successes, errors },
    } = this.props;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h4" className={classes.pageTitle}>
            Forgot password
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors && errors.email}
              error={errors && errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            {errors && errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            {successes && (
              <Typography
                variant="body2"
                style={{ color: "green", marginBottom: 10 }}
              >
                {successes.success}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Submit
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

forgotPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  sendPasswordResetEmail: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearSuccesses: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ UI: state.UI });
const mapActionsToProps = {
  sendPasswordResetEmail,
  clearErrors,
  clearSuccesses,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(forgotPassword));
