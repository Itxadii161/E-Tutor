import React, { useState, useContext } from "react";
import { becomeTutor, getUserRole } from "../api/apiService";
import { UserContext } from "../context/UserContext";

const BecomeTutorForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "male",
    phoneNumber: "",
    city: "",
    country: "",
    highestQualification: "",
    institutionName: "",
    graduationYear: "",
    subjectsOfExpertise: "",
    experienceYears: "",
    pastInstitutions: "",
    certifications: "",
    availabilityDays: "",
    availabilityTimeSlots: "",
    resumeUrl: "",
    educationCertificates: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setRole } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "educationCertificates") {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      await becomeTutor(formData);
      setMessage("Application submitted successfully!");
      const token = localStorage.getItem('authToken'); // Get token from storage
      if (token) {
        const roleRes = await getUserRole(token); // Pass token explicitly
        if (roleRes?.role) {
          setRole(roleRes.role);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage(
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        "Something went wrong. Please ensure you're logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  // Configuration array for dynamic rendering
  const inputFields = [
    { name: "fullName", placeholder: "Full Name" },
    { name: "dateOfBirth", type: "date", placeholder: "Date of Birth" },
    {
      name: "gender",
      type: "select",
      options: ["male", "female", "other"],
    },
    { name: "phoneNumber", placeholder: "Phone Number" },
    { name: "city", placeholder: "City" },
    { name: "country", placeholder: "Country" },
    { name: "highestQualification", placeholder: "Highest Qualification" },
    { name: "institutionName", placeholder: "Institution Name" },
    { name: "graduationYear", type: "number", placeholder: "Graduation Year" },
    { name: "subjectsOfExpertise", placeholder: "Subjects (comma-separated)" },
    { name: "experienceYears", type: "number", placeholder: "Experience (years)" },
    { name: "pastInstitutions", placeholder: "Past Institutions (comma-separated)" },
    { name: "certifications", placeholder: "Certifications (comma-separated)" },
    { name: "availabilityDays", placeholder: "Available Days (comma-separated)" },
    { name: "availabilityTimeSlots", placeholder: "Time Slots (comma-separated)" },
    { name: "resumeUrl", placeholder: "Resume URL" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white text-black rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-8">
          Become a Tutor
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => {
            if (field.type === "select") {
              return (
                <select
                  key={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              );
            }

            return (
              <input
                key={field.name}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                required={field.name === "fullName" || field.name === "resumeUrl"}
              />
            );
          })}

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Upload Education Certificates:</label>
            <input
              name="educationCertificates"
              type="file"
              onChange={handleChange}
              multiple
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-lg text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default BecomeTutorForm;
