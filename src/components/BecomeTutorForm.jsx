import React, { useState, useContext, useRef, useEffect } from "react";
import { becomeTutor, getUserRole } from "../api/apiService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const BecomeTutorForm = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

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
    resumeFile: null,
    educationCertificates: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { setRole } = useContext(UserContext);

  useEffect(() => {
    if (inputRefs.current[currentFieldIndex]) {
      inputRefs.current[currentFieldIndex].focus();
    }
  }, [currentFieldIndex]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, inputRefs.current.length - 1);
      setCurrentFieldIndex(nextIndex);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "educationCertificates") {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else if (name === "resumeFile") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (!formData.fullName || !formData.resumeFile || formData.educationCertificates.length === 0) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("resume", formData.resumeFile);
      formData.educationCertificates.forEach((file, index) => {
        formDataToSubmit.append(`educationCertificates[${index}]`, file);
      });

      const uploadResponse = await uploadFiles(formDataToSubmit);
      const updatedFormData = {
        ...formData,
        resumeUrl: uploadResponse.resumeUrl,
        educationCertificates: uploadResponse.educationCertificates,
      };

      await becomeTutor(updatedFormData);
      setMessage({ text: "Application submitted successfully!", type: "success" });

      const token = localStorage.getItem("authToken");
      if (token) {
        const roleRes = await getUserRole(token);
        if (roleRes?.role) setRole(roleRes.role);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Submission failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          resumeUrl: "https://example.com/resume-file-url",
          educationCertificates: [
            "https://example.com/certificate1-url",
            "https://example.com/certificate2-url",
          ],
        });
      }, 2000);
    });
  };

  const inputFields = [
    { name: "fullName", placeholder: "Full Name *", required: true },
    { name: "dateOfBirth", type: "date", placeholder: "Date of Birth" },
    {
      name: "gender",
      type: "select",
      options: ["male", "female", "other"],
      placeholder: "Gender",
    },
    { name: "phoneNumber", placeholder: "Phone Number", type: "tel" },
    { name: "city", placeholder: "City" },
    { name: "country", placeholder: "Country" },
    { name: "highestQualification", placeholder: "Highest Qualification *", required: true },
    { name: "institutionName", placeholder: "Institution Name *", required: true },
    {
      name: "graduationYear",
      type: "number",
      placeholder: "Graduation Year",
      min: 1900,
      max: new Date().getFullYear(),
    },
    { name: "subjectsOfExpertise", placeholder: "Subjects (comma separated) *", required: true },
    { name: "experienceYears", type: "number", placeholder: "Experience (years)", min: 0 },
    { name: "pastInstitutions", placeholder: "Past Institutions (comma separated)" },
    { name: "certifications", placeholder: "Certifications (comma separated)" },
    { name: "availability", placeholder: "Availability (e.g., Mon-Fri 9am-5pm)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:block md:w-1/3 bg-gradient-to-b from-pink-600 to-purple-600 p-8 flex flex-col justify-center">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-4">Share Your Knowledge</h1>
              <p className="mb-6">
                Join our community of expert educators and inspire the next generation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Flexible teaching hours
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Competitive earnings
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Global student reach
                </li>
              </ul>
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Become a Tutor</h2>
            <p className="text-gray-600 mb-8">Fill out the form to start your teaching journey</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields.map((field, index) => {
                  const { name, ...restProps } = {
                    name: field.name,
                    value: formData[field.name],
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                    ref: (el) => (inputRefs.current[index] = el),
                    className:
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition",
                    placeholder: field.placeholder,
                    required: field.required,
                  };

                  if (field.type === "select") {
                    return (
                      <select key={field.name} name={name} {...restProps}>
                        <option value="">{field.placeholder}</option>
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
                      name={name}
                      type={field.type || "text"}
                      min={field.min}
                      max={field.max}
                      {...restProps}
                    />
                  );
                })}
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education Certificates *
                  </label>
                  <input
                    name="educationCertificates"
                    type="file"
                    onChange={handleChange}
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV *
                  </label>
                  <input
                    name="resumeFile"
                    type="file"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>

              {message.text && (
                <div
                  className={`mt-4 p-3 rounded-lg ${
                    message.type === "error"
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeTutorForm;
