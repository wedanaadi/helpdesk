import AuthConsumer from "./Auth";
import {useLocation, Navigate} from 'react-router-dom'
import { baseUrl } from "../util/BaseUrl";

export const RequiredLogin = ({ children }) => {
  const [authed] = AuthConsumer();
  const location = useLocation();
  return authed.auth === true ? (
    <Navigate to={"/"} replace={true} />
    ) : (
      <Navigate to={"/login"} replace={true} />
  );
};