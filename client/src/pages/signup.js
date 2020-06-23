import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/icon.png";
import { Link } from "react-router-dom";
// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const styles = (theme) => ({ ...theme.spreadThis });

function Signup({ classes, user, UI: { loading, errors }, signupUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [handle, setHandle] = useState("");

  const handleChange = (event, setState) => setState(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUserData = {
      email,
      password,
      confirmPassword,
      handle,
      nickname: handle,
    };
    signupUser(newUserData);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item md={6} sm={10}>
        <img src={AppIcon} alt="monkey" className={classes.image} />
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            helperText={errors && errors.email}
            error={errors && errors.email ? true : false}
            value={email}
            onChange={(e) => handleChange(e, setEmail)}
            fullWidth
          />
          <TextField
            variant="outlined"
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            helperText={errors && errors.password}
            error={errors && errors.password ? true : false}
            value={password}
            onChange={(e) => handleChange(e, setPassword)}
            fullWidth
          />
          <TextField
            variant="outlined"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            className={classes.textField}
            helperText={errors && errors.confirmPassword}
            error={errors && errors.confirmPassword ? true : false}
            value={confirmPassword}
            onChange={(e) => handleChange(e, setConfirmPassword)}
            fullWidth
          />
          <TextField
            variant="outlined"
            id="handle"
            name="handle"
            type="text"
            label="Username"
            className={classes.textField}
            helperText={errors && errors.handle}
            error={errors && errors.handle ? true : false}
            value={handle}
            onChange={(e) => handleChange(e, setHandle)}
            fullWidth
          />
          {errors && errors.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
            style={{ marginTop: 10, width: 100, height: 40 }}
          >
            Signup
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <br />
          <small>
            Already have an account? Login <Link to="/login">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ user: state.user, UI: state.UI });
const mapActionsToProps = { signupUser };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Signup));
