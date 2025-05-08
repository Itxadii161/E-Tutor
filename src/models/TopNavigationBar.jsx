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
      const imageUrlWithCacheBust = `${API_BASE_URL}${user.image}?t=${Date.now()}`;
      setProfileImageUrl(imageUrlWithCacheBust);
      setLoadingImage(true);
      setImageError(false); // Reset error on new image URL
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
    setProfileImageUrl("/default-profile.png"); // Fallback to default on error
  };

  return (
    <div className="top-navigation-bar flex items-center justify-between bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 text-white p-6 rounded-xl shadow-xl">
      <div className="profile-info flex items-center space-x-6">
        {/* Profile Image Section */}
        {profileImageUrl ? (
          <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden">
            {loadingImage && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
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
          <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
            {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
          </div>
        )}

        {/* Profile Details */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md text-sm text-indigo-100 w-full max-w-md space-y-2">
          <h3 className="text-white text-2xl font-extrabold tracking-tight">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-indigo-200 font-semibold uppercase text-xs tracking-wide">
            {roleLabels[role] || "User"}
          </p>

          {user?.rating && (
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-indigo-100 font-semibold">Rating:</span>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {user.rating}
              </span>
            </div>
          )}

          <hr className="border-indigo-400/30" />

          <p className="text-indigo-100 leading-snug italic">
            {user?.bio?.length > 100 ? `${user.bio.slice(0, 100)}...` : user?.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-full text-white hover:bg-red-700 transition duration-300 ease-in-out shadow-lg hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
};

export default TopNavigationBar;