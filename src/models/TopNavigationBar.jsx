import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../api/apiService"; // Make sure this path is correct
import { UserContext } from "../context/UserContext";

const TopNavigationBar = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const roleLabels = {
    tutor: "Tutor",
    student: "Student",
    "pending-tutor": "Pending Approval",
  };

  const fetchUser = async () => {
    try {
      const data = await getUserData();
      setUser(data.user || data); // adapt to your backend structure
      setRole(data.user?.role || data.role || "User");
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout()
    // navigate("/");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-4 text-white">Loading user info...</div>;
  }

  const profileImageUrl = user?.image || "/default-profile.png";

  return (
    <div
      className="top-navigation-bar flex items-center justify-between p-4 rounded-xl shadow-xl w-full"
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        background:
          "linear-gradient(90deg, rgba(236, 72, 153, 0.85) 0%, rgba(128, 90, 213, 0.85) 50%, rgba(99, 102, 241, 0.85) 100%)",
      }}
    >
      <div className="flex items-center space-x-6 w-full">
        {/* Profile Image */}
        <div className="relative w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600">
          <img
            src={profileImageUrl}
            alt={`${user?.firstName} ${user?.lastName}'s profile`}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/default-profile.png")}
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-2xl font-semibold text-white">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-gray-200 text-sm font-medium">
            {roleLabels[role?.toLowerCase()] || "User"}
          </p>

          {user?.rating && (
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-white font-semibold">Rating:</span>
              <span className="bg-yellow-300 text-black px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {user.rating}
              </span>
            </div>
          )}

          <hr className="border-gray-300 my-1" />

          <p className="text-white text-sm">
            {user?.bio?.slice(0, 50)}
            {user?.bio?.length > 50 ? "..." : ""}
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default TopNavigationBar;
