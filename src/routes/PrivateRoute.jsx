//# Component bảo vệ route theo role

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
  const user = useSelector((state)=>state.auth.user);
  
  if(!user){
    return <Navigate to = "/login"></Navigate>
  }
  const roles = useSelector((state)=> state.auth.roles) || [];


  if (roles.length === 0) {
    return <Navigate to="/login" />;
  }


  const hasPermission = roles.some((role) => allowedRoles.includes(role));

  return hasPermission ? <Outlet /> : <Navigate to="/" />;
};


export default PrivateRoute;
