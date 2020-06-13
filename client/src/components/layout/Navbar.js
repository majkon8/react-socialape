import React, { Component } from "react";
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
import { clearErrors } from "../../redux/actions/dataActions";

const styles = (theme) => ({ ...theme.spreadThis });

export class Navbar extends Component {
  render() {
    const { authenticated, clearErrors } = this.props;

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
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { clearErrors })(
  withStyles(styles)(Navbar)
);
