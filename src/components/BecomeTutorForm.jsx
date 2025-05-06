import React, { useState, useContext } from "react";
import { becomeTutor, getUserRole } from "../api/apiService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const BecomeTutorForm = () => {
  const navigate = useNavigate();

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
    availability: "",
    resumeFile: null,  // Added to handle the file upload for resume
    educationCertificates: [], // Handles multiple file uploads
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setRole } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "educationCertificates") {
      setFormData({ ...formData, [name]: Array.from(files) }); // Handle multiple files
    } else if (name === "resumeFile") {
      setFormData({ ...formData, [name]: files[0] }); // Only one resume file
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic Validation
    if (!formData.fullName || !formData.resumeFile || formData.educationCertificates.length === 0) {
      setMessage("Please ensure all required fields are filled.");
      setLoading(false);
      return;
    }

    try {
      // File handling: upload resume and certificates first
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("resume", formData.resumeFile);
      formData.educationCertificates.forEach((file, index) => {
        formDataToSubmit.append(`educationCertificates[${index}]`, file);
      });

      // Call the API to upload the files (replace this with actual API logic)
      const uploadResponse = await uploadFiles(formDataToSubmit);

      // Assuming the backend returns URLs for the uploaded files
      const updatedFormData = {
        ...formData,
        resumeUrl: uploadResponse.resumeUrl, // Assume this is the URL of the uploaded resume
        educationCertificates: uploadResponse.educationCertificates, // URLs of uploaded certificates
      };

      // Call the becomeTutor API with the updated data
      await becomeTutor(updatedFormData);

      setMessage("Application submitted successfully!");
      const token = localStorage.getItem('authToken');
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

  // Function to simulate file upload (replace with actual API call)
  const uploadFiles = async (formData) => {
    // Simulate uploading files and return the URLs
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          resumeUrl: "https://example.com/resume-file-url", // Simulated URL
          educationCertificates: [
            "https://example.com/certificate1-url",
            "https://example.com/certificate2-url",
          ], // Simulated URLs for education certificates
        });
      }, 2000); // Simulate file upload delay
    });
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
    { name: "availability", placeholder: "Availability days and time." },
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
                required={field.name === "fullName" || field.name === "resumeFile"}
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

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Upload Resume:</label>
            <input
              name="resumeFile"
              type="file"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none"
              required
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
