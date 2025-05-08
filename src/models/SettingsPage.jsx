import React, { useState, useEffect, useContext, useCallback } from "react";
import { updateProfile } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SettingsPage = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", bio: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || ""
      });
      if (user.image) {
        setImagePreview(user.image);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous error
    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImage(file);
    setImagePreview(previewUrl);
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      
      // Validate required fields
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
        throw new Error("First name, last name, and email are required");
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Only append changed fields
      if (form.firstName !== user.firstName) formData.append("firstName", form.firstName);
      if (form.lastName !== user.lastName) formData.append("lastName", form.lastName);
      if (form.email !== user.email) formData.append("email", form.email);
      if (form.bio !== user.bio) formData.append("bio", form.bio);

      if (image) {
        formData.append("image", image);
      }

      // Check if there are actually changes
      if (formData.entries().next().done && !image) {
        setSuccess("No changes detected");
        return;
      }

      const response = await updateProfile(formData);

      if (response?.user) {
        updateUser(response.user);
        setSuccess("Profile updated successfully!");
        setImage(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      
      // Handle specific error messages
      let errorMessage = err.message;
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.message.includes("File size exceeds")) {
        errorMessage = "Image size must be less than 5MB";
      } else if (err.message.includes("image")) {
        errorMessage = "Only JPEG, PNG, and JPG images are allowed";
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-indigo-50 rounded-xl p-6 shadow-sm max-w-2xl mx-auto mt-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-800">Edit Profile</h2>
        <p className="text-indigo-600">Update your information</p>
      </div>

      {(error || success) && (
        <div className={`mb-4 p-3 rounded-md ${
          error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}>
          <p className="text-center">{error || success}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {["firstName", "lastName"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block mb-1 text-indigo-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                id={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-indigo-700">Email</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 bg-white border border-indigo-200 rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block mb-1 text-indigo-700">Bio</label>
          <textarea
            id="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            className="w-full p-2 bg-white border border-indigo-200 rounded-lg"
            maxLength={500}
          />
          <p className="text-xs text-indigo-500 mt-1">
            {form.bio.length}/500 characters
          </p>
        </div>

        <div>
          <label className="block mb-1 text-indigo-700">Profile Image</label>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-indigo-100 border border-indigo-300">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-indigo-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-200 text-sm transition">
                {image ? "Change Image" : "Upload Image"}
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <p className="text-xs text-indigo-500 mt-1">
                JPEG, PNG (max 5MB)
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 mt-4 rounded-lg font-medium text-white transition ${
            isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;