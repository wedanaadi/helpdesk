import AuthConsumer from "./Auth";
import {useLocation, Navigate} from 'react-router-dom'
import { baseUrl } from "../util/BaseUrl";

export const RequiredAuth = ({ children }) => {
  const [authed] = AuthConsumer();
  const location = useLocation();
  return authed.auth === true ? (
    children
  ) : (
    <Navigate to={`${baseUrl}/login`} replace state={{ path: location.pathname }} />
  );
};