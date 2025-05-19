import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Or a fancy spinner
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
 