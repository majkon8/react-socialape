import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AuthRoute = ({ component: Component, authenticated, path, ...rest }) => (
  <Route
    {...rest}
    render={() =>
      authenticated ? (
        path === "/" ? (
          <Component {...rest} />
        ) : (
          <Redirect to={"/"} />
        )
      ) : path === "/" ? (
        <Redirect to={"/login"} />
      ) : (
        <Component {...rest} />
      )
    }
  />
);

const mapStateToProps = state => ({ authenticated: state.user.authenticated });

AuthRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(AuthRoute);
