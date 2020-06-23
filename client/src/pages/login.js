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
import { loginUser } from "../redux/actions/userActions";

const styles = (theme) => ({ ...theme.spreadThis });

function Login({ classes, loginUser, UI: { loading, errors } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event, setState) => setState(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { email, password };
    loginUser(userData);
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
            Login
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <br />
          <br />
          <small>
            Don't have an account? Signup <Link to="/signup">here</Link>
          </small>
          <br />
          <small>
            Forgot your password? Click <Link to="/forgot">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ UI: state.UI });
const mapActionsToProps = { loginUser };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Login));
