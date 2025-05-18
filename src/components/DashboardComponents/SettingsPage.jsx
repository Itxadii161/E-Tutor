import React, { useState, useEffect } from "react";
import { updateProfile } from "../../api/apiService";
import { Toaster, toast } from "react-hot-toast";

const SettingsPage = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", bio: "", dateOfBirth: "",
    gender: "", phoneNumber: "", highestQualification: "", institutionName: "",
    graduationYear: "", experienceYears: "", username: ""
  });
  const [address, setAddress] = useState({ country: "", state: "", city: "", village: "" });
  const [availability, setAvailability] = useState({ days: [], timeSlots: [] });
  const [pastInstitutions, setPastInstitutions] = useState([]);
  const [subjectsOfExpertise, setSubjectsOfExpertise] = useState([]);
  const [languagesSpoken, setLanguagesSpoken] = useState([]);
  const [educationCertificates, setEducationCertificates] = useState([]);
  const [resume, setResume] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "", lastName: user.lastName || "",
        email: user.email || "", bio: user.bio || "", username: user.username || "",
        dateOfBirth: user.dateOfBirth?.slice(0, 10) || "", gender: user.gender || "",
        phoneNumber: user.phoneNumber || "", highestQualification: user.highestQualification || "",
        institutionName: user.institutionName || "", graduationYear: user.graduationYear || "",
        experienceYears: user.experienceYears || ""
      });
      setAddress(user.address || { country: "", state: "", city: "", village: "" });
      setAvailability(user.availability || { days: [], timeSlots: [] });
      setPastInstitutions(user.pastInstitutions || []);
      setSubjectsOfExpertise(user.subjectsOfExpertise || []);
      setLanguagesSpoken(user.languagesSpoken || []);
      setPreview(user.image || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleArrayChange = (setter) => (e) => {
    setter(e.target.value.split(",").map((item) => item.trim()));
  };

  const handleFileChange = (e, type = "image") => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    if (type === "resume") {
      setResume(file);
    } else if (type === "image") {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCertificatesChange = (e) => {
    setEducationCertificates(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    Object.entries(form).forEach(([key, value]) => {
      if (value && value !== (initialUser?.[key] ?? "")) {
        formData.append(key, value);
      }
    });
    
    if (address && JSON.stringify(address) !== JSON.stringify(initialUser?.address || {})) {
      formData.append("address", JSON.stringify(address));
    }
    
    if (availability && JSON.stringify(availability) !== JSON.stringify(initialUser?.availability || {})) {
      formData.append("availability", JSON.stringify(availability));
    }
    
    if (JSON.stringify(pastInstitutions) !== JSON.stringify(initialUser?.pastInstitutions || [])) {
      formData.append("pastInstitutions", JSON.stringify(pastInstitutions));
    }
    
    if (JSON.stringify(subjectsOfExpertise) !== JSON.stringify(initialUser?.subjectsOfExpertise || [])) {
      formData.append("subjectsOfExpertise", JSON.stringify(subjectsOfExpertise));
    }
    
    if (JSON.stringify(languagesSpoken) !== JSON.stringify(initialUser?.languagesSpoken || [])) {
      formData.append("languagesSpoken", JSON.stringify(languagesSpoken));
    }
    
    if (image && image !== initialUser?.image) {
      formData.append("image", image);
    }
    
    if (resume && resume !== initialUser?.resumeUrl) {
      formData.append("resume", resume);
    }
    
    if (educationCertificates.length > 0) {
      educationCertificates.forEach((file) =>
        formData.append("educationCertificates", file)
      );
    }
    
    try {
      const response = await updateProfile(formData);
      toast.success("Profile updated successfully!");
      setUser(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Toaster position="top-center" />
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {["personal", "education", "availability", "documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    id="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  id="bio"
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    id="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    id="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    id="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                  <input
                    id="village"
                    value={address.village}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                  <input
                    id="highestQualification"
                    value={form.highestQualification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                  <input
                    id="institutionName"
                    value={form.institutionName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input
                    id="graduationYear"
                    type="number"
                    value={form.graduationYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    id="experienceYears"
                    type="number"
                    value={form.experienceYears}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Past Institutions (comma separated)</label>
                <input
                  value={pastInstitutions.join(", ")}
                  onChange={handleArrayChange(setPastInstitutions)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects of Expertise (comma separated)</label>
                <input
                  value={subjectsOfExpertise.join(", ")}
                  onChange={handleArrayChange(setSubjectsOfExpertise)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken (comma separated)</label>
                <input
                  value={languagesSpoken.join(", ")}
                  onChange={handleArrayChange(setLanguagesSpoken)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
          
          {/* Availability Tab */}
          {activeTab === "availability" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Days (comma separated)</label>
                <input
                  value={availability.days?.join(", ") || ""}
                  onChange={handleArrayChange((val) => setAvailability((prev) => ({ ...prev, days: val })))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Example: Monday, Tuesday, Wednesday</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots (comma separated)</label>
                <input
                  value={availability.timeSlots?.join(", ") || ""}
                  onChange={handleArrayChange((val) => setAvailability((prev) => ({ ...prev, timeSlots: val })))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Example: 9am-12pm, 2pm-5pm</p>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <div className="relative">
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Profile Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                      {form.firstName?.[0] || "U"}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="text-sm text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF/DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="text-sm text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Certificates</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleCertificatesChange}
                  className="text-sm text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">You can upload multiple files</p>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;