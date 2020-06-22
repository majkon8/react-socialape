import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./theme";
import axios from "axios";
import jwtDecode from "jwt-decode";
//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import {
  getUserData,
  loginUser,
  logoutUser,
} from "./redux/actions/userActions";
// Components
import Navbar from "./components/layout/Navbar";
import AuthRoute from "./components/util/AuthRoute";
import UnauthRoute from "./components/util/UnauthRoute";
// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import User from "./pages/user";
import Follows from "./pages/follows";
import Search from "./pages/search";
import ForgotPassword from "./pages/forgotPassword";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL =
  "https://europe-west1-socialape-98946.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    const email = localStorage.userEmail;
    const password = localStorage.userPassword;
    if (localStorage.userEmail && localStorage.userPassword) {
      const userData = { email, password };
      store.dispatch(loginUser(userData));
    } else {
      store.dispatch(logoutUser());
      window.location.href = "/login";
    }
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Navbar></Navbar>
        <div className="container">
          <Switch>
            <UnauthRoute exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/signup" component={Signup} />
            <AuthRoute exact path="/forgot" component={ForgotPassword} />
            <UnauthRoute
              exact
              path="/users/:handle/followers"
              component={Follows}
            />
            <UnauthRoute
              exact
              path="/users/:handle/following"
              component={Follows}
            />
            <UnauthRoute exact path="/users/search/:name" component={Search} />
            <UnauthRoute exact path="/screams/search/:tag" component={Search} />
            <Route exact path="/users/:handle" component={User} />
            <Route
              exact
              path="/users/:handle/scream/:screamId"
              render={(props) => <User {...props} key={Math.random()} />}
            />
            <Redirect from="*" to="/" />
          </Switch>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
