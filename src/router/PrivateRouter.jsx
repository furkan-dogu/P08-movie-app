import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  const { currentUser } = useAuthContext();
  //+ Logout iken tıklayınca logine yönlendiriyor. Loginde iken geri gelme işlemi yapılamıyordu. O sebeple replace ekledim
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRouter;
