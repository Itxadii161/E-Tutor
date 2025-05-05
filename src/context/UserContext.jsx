import React, { createContext, useState, useEffect } from "react";
import { getUserRole } from "../api/apiService";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null); // ✅ added user state
  const [loading, setLoading] = useState(true);  // Loading state for role/user fetching

  useEffect(() => {
    const fetchRole = async () => {
      
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log("No auth token available");
          setLoading(false);

          return;
        }
        try {
        const res = await getUserRole(token);
        if (res?.role) {
          setRole(res.role);
        }
      } catch (err) {
        console.error("Error details:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
      }finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [role]);

  return (
    <UserContext.Provider value={{ role, setRole, user, setUser }}> {/* ✅ included setUser */}
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
