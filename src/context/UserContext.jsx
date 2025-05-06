import React, { createContext, useState, useEffect } from "react";
import { getUserRole } from "../api/apiService";
import { useNavigate } from "react-router-dom"; // Import useNavigate inside the component

// Create a new context to share user-related state across the app
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // const navigate = useNavigate(); // Move useNavigate inside the component
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Function to handle logout and session cleanup
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setRole("");
    setUser(null);
    setSessionExpired(true); // Mark session as expired
    console.log("User logged out successfully");
    // navigate("/login");
  };

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setRole("");
        setUser(null);
        setSessionExpired(true); // Automatically mark session as expired if no token
        setLoading(false);
        // navigate("/login");
        return;
      }

      try {
        const res = await getUserRole(token);
        if (res?.role) {
          setRole(res.role);
          setUser(res.user);
        }
      } catch (err) {
        logout(); // Logout in case of an error
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []); // Only run on initial mount

  return (
    <UserContext.Provider value={{ role, setRole, user, setUser, logout, sessionExpired }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
