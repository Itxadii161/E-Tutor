import React, { useState, useEffect } from "react";
import { updateProfile } from "../api/apiService";
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
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

    type === "resume" ? setResume(file) : setImage(file);
    if (type === "image") setPreview(URL.createObjectURL(file));
  };

  const handleCertificatesChange = (e) => {
    setEducationCertificates(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
  
    const formData = new FormData();
  
    Object.entries(form).forEach(([key, value]) => {
      if (value && value !== (initialUser?.[key] ?? "")) {
        formData.append(key, value);
      }
    });
  
    if (
      address &&
      JSON.stringify(address) !== JSON.stringify(initialUser?.address || {})
    ) {
      formData.append("address", JSON.stringify(address));
    }
  
    if (
      availability &&
      JSON.stringify(availability) !== JSON.stringify(initialUser?.availability || {})
    ) {
      formData.append("availability", JSON.stringify(availability));
    }
  
    if (
      JSON.stringify(pastInstitutions) !==
      JSON.stringify(initialUser?.pastInstitutions || [])
    ) {
      formData.append("pastInstitutions", JSON.stringify(pastInstitutions));
    }
  
    if (
      JSON.stringify(subjectsOfExpertise) !==
      JSON.stringify(initialUser?.subjectsOfExpertise || [])
    ) {
      formData.append("subjectsOfExpertise", JSON.stringify(subjectsOfExpertise));
    }
  
    if (
      JSON.stringify(languagesSpoken) !==
      JSON.stringify(initialUser?.languagesSpoken || [])
    ) {
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
      setSuccess("Profile updated successfully!");
      setUser(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      toast.error(msg);
      setError(msg);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-teal-100 text-gray-800 shadow-lg rounded-lg mt-10">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">Edit Profile</h2>
      {success && <p className="text-green-500 mb-3">{success}</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {["firstName", "lastName", "username", "email", "phoneNumber", "bio", "highestQualification", "institutionName"].map((field) => (
          <input
            key={field}
            id={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
          />
        ))}

        <input
          type="date"
          id="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <select
          id="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {["country", "state", "city", "village"].map((field) => (
          <input
            key={field}
            id={field}
            placeholder={field}
            value={address[field]}
            onChange={handleAddressChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
          />
        ))}

        <textarea
          placeholder="Past Institutions (comma separated)"
          onChange={handleArrayChange(setPastInstitutions)}
          defaultValue={pastInstitutions.join(", ")}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <textarea
          placeholder="Subjects of Expertise (comma separated)"
          onChange={handleArrayChange(setSubjectsOfExpertise)}
          defaultValue={subjectsOfExpertise.join(", ")}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <textarea
          placeholder="Languages Spoken (comma separated)"
          onChange={handleArrayChange(setLanguagesSpoken)}
          defaultValue={languagesSpoken.join(", ")}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <input
          placeholder="Available Days (comma separated)"
          onChange={handleArrayChange((val) => setAvailability((prev) => ({ ...prev, days: val })))}
          defaultValue={availability.days?.join(", ")}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <input
          placeholder="Available Time Slots (comma separated)"
          onChange={handleArrayChange((val) => setAvailability((prev) => ({ ...prev, timeSlots: val })))}
          defaultValue={availability.timeSlots?.join(", ")}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <input
          type="number"
          id="graduationYear"
          placeholder="Graduation Year"
          value={form.graduationYear}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <input
          type="number"
          id="experienceYears"
          placeholder="Experience Years"
          value={form.experienceYears}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
        />

        <div className="flex flex-col space-y-4">
          <label className="text-lg text-indigo-600">Profile Image</label>
          {preview ? (
            <img src={preview} alt="Preview" className="w-28 h-28 rounded-full object-cover mb-3" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
              {form.firstName?.[0] || "U"}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            className="p-2 border border-gray-300 rounded-lg"
          />

          <label className="text-lg text-indigo-600">Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "resume")}
            className="p-2 border border-gray-300 rounded-lg"
          />

          <label className="text-lg text-indigo-600">Certificates</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleCertificatesChange}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
