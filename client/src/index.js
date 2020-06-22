import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

axios.interceptors.request.use(async (req) => {
  let idToken;
  if (
    req.headers.common.Authorization &&
    req.headers.common.Authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.common.Authorization.split("Bearer ")[1];
    const decodedToken = jwtDecode(idToken);
    const APIKey = "AIzaSyCruf7hxmHGvY6AvXNvxC2W4ALYLhhtBUQ";
    const refreshToken = localStorage.FBRefreshToken;
    console.log(idToken);
    if (decodedToken.exp * 1000 > Date.now()) {
      try {
        const res = await fetch(
          `https://securetoken.googleapis.com/v1/token?key=${APIKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
          }
        );
        const newTokenData = await res.json();
        const newIdToken = `Bearer ${newTokenData.id_token}`;
        localStorage.setItem("FBIdToken", newIdToken);
        req.headers.common.Authorization = newIdToken;
      } catch (err) {
        console.log(err);
      }
    }
  }
  return req;
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
