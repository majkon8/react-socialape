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
import { getUserData } from "./redux/actions/userActions";
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

axios.interceptors.request.use(async (req) => {
  let idToken;
  if (
    req.headers.common.Authorization &&
    req.headers.common.Authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.common.Authorization.split("Bearer ")[1];
    const decodedToken = jwtDecode(idToken);
    if (decodedToken.exp * 1000 < Date.now()) req = await refreshToken(req);
  }
  return req;
});

async function refreshToken(req) {
  const APIKey = "AIzaSyCruf7hxmHGvY6AvXNvxC2W4ALYLhhtBUQ";
  const FBRefreshToken = localStorage.FBRefreshToken;
  try {
    const res = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${APIKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${FBRefreshToken}`,
      }
    );
    const newTokenData = await res.json();
    const newIdToken = `Bearer ${newTokenData.id_token}`;
    localStorage.setItem("FBIdToken", newIdToken);
    axios.defaults.headers.common["Authorization"] = newIdToken;
    req.headers.Authorization = newIdToken;
  } catch (err) {
    console.log(err);
  } finally {
    return req;
  }
}

const token = localStorage.FBIdToken;
if (token) {
  store.dispatch({ type: SET_AUTHENTICATED });
  axios.defaults.headers.common["Authorization"] = token;
  store.dispatch(getUserData());
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
