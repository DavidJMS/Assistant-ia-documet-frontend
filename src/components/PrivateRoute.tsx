import { Navigate } from "react-router-dom";
import React  from "react";

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
