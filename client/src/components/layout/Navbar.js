import React, { useState, useEffect } from "react";
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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
// Icons
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
// Redux
import { connect } from "react-redux";
import { clearErrors, clearSuccesses } from "../../redux/actions/uiActions";
import { logoutUser } from "../../redux/actions/userActions";
import store from "../../redux/store";

const styles = (theme) => ({
  ...theme.spreadThis,
  logoutButton: {
    position: "absolute",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: 30,
    color: "white",
  },
  menuButton: { color: "white" },
});

function Navbar({ authenticated, clearErrors, clearSuccesses, classes }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => setWindowWidth(window.innerWidth);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  };

  return windowWidth > 800 ? (
    <AppBar>
      {authenticated && (
        <MyButton
          btnClassName={classes.logoutButton}
          tip="Log out"
          onClick={handleLogout}
        >
          <ExitToAppIcon />
        </MyButton>
      )}
      <Toolbar className="nav-container">
        {authenticated ? (
          <>
            <PostScream showIcon />
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
  ) : (
    <AppBar>
      <Toolbar style={{ paddingLeft: 10, paddingRight: 10 }}>
        <MyButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          tip="Open menu"
          btnClassName={classes.menuButton}
        >
          <MenuIcon />
        </MyButton>
        <Notifications />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ marginTop: 30 }}
        >
          <MenuItem>
            <Link style={{ color: "black" }} to="/">
              Home
            </Link>
          </MenuItem>
          {authenticated && (
            <MenuItem>
              <PostScream />
            </MenuItem>
          )}
          {authenticated && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
          {!authenticated && (
            <MenuItem
              onClick={() => {
                clearErrors();
                clearSuccesses();
              }}
            >
              <Link style={{ color: "black" }} to="/login">
                Login
              </Link>
            </MenuItem>
          )}
          {!authenticated && (
            <MenuItem
              onClick={() => {
                clearErrors();
                clearSuccesses();
              }}
            >
              <Link style={{ color: "black" }} to="/signup">
                Signup
              </Link>
            </MenuItem>
          )}
        </Menu>
        <Search />
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
