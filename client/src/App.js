import React from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./theme";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshToken } from "./util";
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
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import user from "./pages/user";
import follows from "./pages/follows";
import search from "./pages/search";
import forgotPassword from "./pages/forgotPassword";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL =
  "https://europe-west1-socialape-98946.cloudfunctions.net/api";

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    const userEmail = localStorage.userEmail;
    const userPassword = localStorage.userPassword;
    if (localStorage.userEmail && localStorage.userPassword) {
      loginUser({ userEmail, userPassword });
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
  const location = useLocation();

  React.useEffect(() => {
    if (token)
      setTimeout(() => {
        refreshToken();
      }, 1000);
  }, [location]);

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Navbar></Navbar>
        <div className="container">
          <Switch>
            <UnauthRoute exact path="/" component={home} />
            <AuthRoute exact path="/login" component={login} />
            <AuthRoute exact path="/signup" component={signup} />
            <AuthRoute exact path="/forgot" component={forgotPassword} />
            <UnauthRoute
              exact
              path="/users/:handle/followers"
              component={follows}
            />
            <UnauthRoute
              exact
              path="/users/:handle/following"
              component={follows}
            />
            <UnauthRoute exact path="/users/search/:name" component={search} />
            <UnauthRoute exact path="/screams/search/:tag" component={search} />
            <Route exact path="/users/:handle" component={user} />
            <Route
              exact
              path="/users/:handle/scream/:screamId"
              component={user}
            />
            <Redirect from="*" to="/" />
          </Switch>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
