import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authProvider";

export const ProtectedRoute = ({ roles }) => {
  const { token } = useAuth();
  const role = token && token.role;
  roles && console.log(roles.includes(role));
  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
