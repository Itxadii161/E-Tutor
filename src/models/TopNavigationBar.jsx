import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../api/apiService';

const TopNavigationBar = () => {
  const { user, role, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const roleLabels = {
    tutor: "Teacher",
    student: "Student",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user?.image) {
      const imageUrlWithCacheBust = `${API_BASE_URL}/${user.image}?t=${Date.now()}`;
      setProfileImageUrl(imageUrlWithCacheBust);
      setLoadingImage(true);
      setImageError(false);
    } else {
      setProfileImageUrl(null);
    }
  }, [user?.image]);

  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  const handleImageError = () => {
    setLoadingImage(false);
    setImageError(true);
    setProfileImageUrl("/default-profile.png");
  };

  return (
    <div className="top-navigation-bar flex items-center justify-between p-4 rounded-xl shadow-xl w-full" style={{ maxWidth: '100%', margin: '0 auto', background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.85) 0%, rgba(128, 90, 213, 0.85) 50%, rgba(99, 102, 241, 0.85) 100%)' }}>
      <div className="flex items-center space-x-6 w-full">
        {/* Profile Image Section */}
        {profileImageUrl ? (
          <div className="relative w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600">
            {loadingImage && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c-4.411 0-8 3.589-8 8z"></path>
                </svg>
              </div>
            )}
            <img
              key={profileImageUrl}
              src={profileImageUrl}
              alt={`${user?.firstName} ${user?.lastName}'s profile`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loadingImage ? 'opacity-0' : 'opacity-100'} ${imageError ? 'object-contain bg-gray-300' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
            {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
          </div>
        )}

        {/* Profile Details Section */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-2xl font-semibold text-white">{user?.firstName} {user?.lastName}</h3>
          <p className="text-gray-200 text-sm font-medium">{roleLabels[role] || "User"}</p>

          {user?.rating && (
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-white font-semibold">Rating:</span>
              <span className="bg-yellow-300 text-black px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {user.rating}
              </span>
            </div>
          )}

          <hr className="border-gray-300 my-1" />

          <p className="text-white text-sm">{user?.bio?.slice(0, 50)}{user?.bio?.length > 50 ? "..." : ""}</p>
        </div>
      </div>

      {/* Logout Button */}
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
