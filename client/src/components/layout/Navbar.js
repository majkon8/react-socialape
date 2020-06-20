import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import PostScream from "../scream/PostScream";
import Notifications from "./Notifications";
import withStyles from "@material-ui/core/styles/withStyles";
import Search from "../util/Search";
// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
// Icons
import HomeIcon from "@material-ui/icons/Home";
// Redux
import { connect } from "react-redux";
import { clearErrors, clearSuccesses } from "../../redux/actions/uiActions";

const styles = (theme) => ({ ...theme.spreadThis });

function Navbar({ authenticated, clearErrors, clearSuccesses }) {
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
            <Search />
          </>
        ) : (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/"
              onClick={() => {
                clearErrors();
                clearSuccesses();
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              onClick={() => {
                clearErrors();
                clearSuccesses();
              }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              onClick={() => {
                clearErrors();
                clearSuccesses();
              }}
            >
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired,
  clearSuccesses: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

const mapActionsToProps = { clearErrors, clearSuccesses };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Navbar));
