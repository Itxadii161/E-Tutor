import React, { useState } from "react";

const Settings = () => {
  // State for storing user details
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    title: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save user profile (Mock saving with console log)
  const handleSaveChanges = () => {
    console.log("Updated Profile:", user);
    alert("Profile updated successfully!");
  };

  // Change password logic
  const handleChangePassword = () => {
    if (user.newPassword !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Password Updated:", user.newPassword);
    alert("Password changed successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6">Account Settings</h2>

      {/* Profile Section */}
      <div className="flex items-center gap-6">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <div className="w-24 h-24 border rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : "Upload"}
          </div>
        </label>
        <p className="text-sm text-gray-500">Image should be under 1MB and ratio 1:1</p>
      </div>

      {/* Account Information Form */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <input type="text" name="firstName" value={user.firstName} onChange={handleChange} placeholder="First name" className="p-2 border rounded-md" />
        <input type="text" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last name" className="p-2 border rounded-md" />
        <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username" className="col-span-2 p-2 border rounded-md" />
        <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email address" className="col-span-2 p-2 border rounded-md" />
        <input type="text" name="title" value={user.title} onChange={handleChange} placeholder="Your title, profession or biography" className="col-span-2 p-2 border rounded-md" />
      </div>

      <button onClick={handleSaveChanges} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg">Save Changes</button>

      {/* Change Password Section */}
      <h2 className="text-xl font-bold mt-10 mb-4">Change Password</h2>
      <div className="grid grid-cols-2 gap-4">
        <input type="password" name="currentPassword" value={user.currentPassword} onChange={handleChange} placeholder="Current Password" className="col-span-2 p-2 border rounded-md" />
        <input type="password" name="newPassword" value={user.newPassword} onChange={handleChange} placeholder="New Password" className="col-span-2 p-2 border rounded-md" />
        <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="col-span-2 p-2 border rounded-md" />
      </div>

      <button onClick={handleChangePassword} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg">Change Password</button>
    </div>
  );
};

export default Settings;
