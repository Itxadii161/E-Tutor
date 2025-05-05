import React, { createContext, useState, useEffect } from "react";
import { getUserRole } from "../api/apiService";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log("No auth token available");
          return;
        }
        
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
      }
    };
  
    fetchRole();
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;