import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
import PostScream from "../scream/PostScream";
import Notifications from "./Notifications";
import withStyles from "@material-ui/core/styles/withStyles";
// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// Icons
import HomeIcon from "@material-ui/icons/Home";
// Redux
import { connect } from "react-redux";
import { clearErrors } from "../../redux/actions/dataActions";

const styles = theme => ({
  ...theme.spreadThis,
  searchField: {
    "& input.MuiTextField-root": { color: "white" },
    "& label.MuiInputLabel-root": { color: "white" },
    "& label.Mui-focused": { color: "#00bcd4" },
    "& .MuiInput-underline:after": { borderBottomColor: "#00bcd4" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.7)" },
      "&.Mui-focused fieldset": { borderColor: "#00bcd4" }
    }
  },
  input: { color: "white" }
});

export class Navbar extends Component {
  render() {
    const { authenticated, clearErrors, classes } = this.props;

    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <>
              <PostScream />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              <Notifications />
              <TextField
                size="small"
                variant="outlined"
                color="secondary"
                name="search"
                type="text"
                label="Search"
                fullWidth
                className={classes.searchField}
                InputProps={{
                  className: classes.input
                }}
              />
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                onClick={clearErrors}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                onClick={clearErrors}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/signup"
                onClick={clearErrors}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ authenticated: state.user.authenticated });

export default connect(mapStateToProps, { clearErrors })(
  withStyles(styles)(Navbar)
);
