import axios from "axios";
import { setAuthorizationHeader } from "./redux/actions/userActions";

export const refreshToken = () => {
  axios.get("/refresh").then((res) => setAuthorizationHeader(res.data));
};
