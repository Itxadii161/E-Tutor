import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { updateProfile } from "../api/apiService";
import { API_BASE_URL } from '../api/apiService';

const SettingsPage = () => {
  const { user, updateUser } = useContext(UserContext);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", bio: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || ""
      });
      setPreview(user.image ? `${API_BASE_URL}/uploads/${user.image}` : null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return setError("Only image files allowed");
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError("Image size must be under 5MB");
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value && value !== user[key]) {
        formData.append(key, value);
      }
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await updateProfile(formData);
      if (response?.user) {
        updateUser(response.user);
        setForm({ firstName: "", lastName: "", email: "", bio: "" });
        setImage(null);
        setPreview(null);
        setSuccess("Profile updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-teal-100 text-gray-800 shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">Edit Profile</h2>

      {success && <p className="text-green-500 mb-3">{success}</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          id="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />
        <input
          id="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />
        <input
          id="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />
        <textarea
          id="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
          maxLength={500}
        />

        <div className="flex flex-col items-center space-y-4">
          <label className="text-lg text-indigo-600">Profile Image</label>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover mb-3 border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 text-center flex items-center justify-center text-xl font-bold text-gray-600 mb-3">
              {user?.firstName?.[0] || user?.lastName?.[0] || "U"}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border border-indigo-600 rounded-lg text-indigo-600 cursor-pointer hover:bg-indigo-50"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-all duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
