import React, { createContext, useState, useEffect } from "react";
import { getUserRole } from "../api/apiService"; // renamed for clarity

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // User state with persistent storage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [role, setRole] = useState(() => {
    // You can initialize the role from the stored user or an empty string
    const storedRole = localStorage.getItem("userRole");
    return storedRole ? storedRole.toLowerCase() : ""; 
    
  });

  const [loading, setLoading] = useState(true);  // Loading state while fetching user
  const [sessionExpired, setSessionExpired] = useState(false);  // Handle session expiry

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setUser(null);
    setRole("");  // Reset role during logout
    setSessionExpired(true);  // Mark session as expired
    console.log("User logged out successfully");
  };

  // Update user function (store the updated user)
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
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
        const res = await getUserRole(token);
        if (res?.user) {
          setUser(res.user);  // Set user to state if fetched successfully
          const normalizedRole = res.user.role?.toLowerCase();
          setRole(normalizedRole);
          localStorage.setItem("userRole", normalizedRole);
          localStorage.setItem("user", JSON.stringify(res.user));  // Store user in localStorage
          // setRole(res.user.role);  // Set role to state
          // localStorage.setItem("userRole", res.user.role);  // Store role in localStorage

        } else {
          logout();  // Logout if user role not fetched properly
        }
      } catch (err) {
        logout(); // Clear session on error
      } finally {
        setLoading(false);  // Set loading to false after API call
      }
    };

    // Fetch user data on initial load if no user is set
    if (!user) {
      fetchUser();
    } else {
      setLoading(false);  // Set loading to false if user already exists
    }
  }, [user]);  // Run effect if user changes

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole, logout, updateUser, sessionExpired }}>
      {!loading && children} {/* Render children only if loading is complete */}
    </UserContext.Provider>
  );
};

export default UserProvider;
