//# Component bảo vệ route theo role

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
