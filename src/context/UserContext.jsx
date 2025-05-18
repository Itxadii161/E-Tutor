import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserData } from "../api/apiService";

export const UserContext = createContext();
export const useAuth = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setRole("");
    setSessionExpired(true);
    console.log("User logged out successfully");
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    const newRole = updatedUserData?.role?.toLowerCase() || "";
    setRole(newRole);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const res = await getUserData();
        if (res?.user) {
          updateUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error("User fetch error:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // always revalidate from API
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole, logout, updateUser, sessionExpired }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;
