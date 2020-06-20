import React, { useState } from "react";
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

const styles = (theme) => ({ ...theme.spreadThis });

function ForgotPassword({
  classes,
  UI: { loading, successes, errors },
  sendPasswordResetEmail,
}) {
  const [email, setEmail] = useState("");

  const handleChange = (event) => setEmail(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendPasswordResetEmail({ email });
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <img src={AppIcon} alt="monkey" className={classes.image} />
        <Typography variant="h4" className={classes.pageTitle}>
          Forgot password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            helperText={errors && errors.email}
            error={errors && errors.email ? true : false}
            value={email}
            onChange={handleChange}
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

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  sendPasswordResetEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ UI: state.UI });
const mapActionsToProps = { sendPasswordResetEmail };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(ForgotPassword));
