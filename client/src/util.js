import axios from "axios";
import { setAuthorizationHeader } from "./redux/actions/userActions";

export const refreshToken = async () => {
  const res = await axios.get("/refresh");
  setAuthorizationHeader(res.data);
};
