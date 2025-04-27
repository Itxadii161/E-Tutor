// import React, { useState } from "react";

// const BecomeTutorForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     subject: "",
//     bio: "",
//     experience: "",
//     city: "",
//     location: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data Submitted:", formData);
//     alert("Thank you for applying to become a tutor! We will review your details and get back to you.");
//     setFormData({
//       fullName: "",
//       email: "",
//       phone: "",
//       subject: "",
//       bio: "",
//       experience: "",
//       city: "",
//       location: "",
//     });
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-8 font-sans bg-gradient-to-br from-pink-600 via-gray-100 to-black rounded-3xl shadow-2xl">
//       <h2 className="text-4xl font-extrabold text-center text-white mb-8">Become a Tutor</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-8">
//         <label className="block">
//           <span className="text-white text-lg font-semibold">Full Name:</span>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">Email Address:</span>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">Phone Number:</span>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">City:</span>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">Location:</span>
//           <input
//             type="text"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">Subject Expertise:</span>
//           <input
//             type="text"
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">Brief Bio:</span>
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none resize-none"
//           />
//         </label>

//         <label className="block">
//           <span className="text-white text-lg font-semibold">Years of Experience:</span>
//           <input
//             type="number"
//             name="experience"
//             value={formData.experience}
//             onChange={handleChange}
//             required
//             className="w-full mt-3 p-4 border border-gray-300 rounded-xl shadow-lg focus:ring focus:ring-pink-300 focus:outline-none"
//           />
//         </label>

//         <button
//           type="submit"
//           className="bg-gradient-to-r from-pink-500 to-pink-700 text-white py-4 px-8 rounded-xl shadow-lg hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring focus:ring-pink-300"
//         >
//           Submit Application
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BecomeTutorForm;
import React, { useState } from "react";

const BecomeTutorForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    bio: "",
    experience: "",
    city: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Thank you for applying to become a tutor! We will review your details and get back to you.");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      bio: "",
      experience: "",
      city: "",
      location: "",
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex justify-center items-center p-6 overflow-hidden relative"
    >
      {/* Floating Decorative Elements */}
      <div className="absolute w-96 h-96 bg-pink-500 opacity-30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute w-72 h-72 bg-blue-500 opacity-30 rounded-full blur-3xl bottom-10 right-10 animate-float-delay"></div>

      <div className="max-w-4xl w-full bg-gradient-to-tr from-gray-50 to-gray-200 rounded-3xl shadow-2xl p-12 relative animate-slide-up">
        <h2 className="text-5xl font-bold text-center text-pink-600 mb-8 animate-pulse">
          Become a Tutor
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {[
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "phone", label: "Phone Number", type: "tel" },
            { name: "city", label: "City", type: "text" },
            { name: "location", label: "Location", type: "text" },
            { name: "subject", label: "Subject Expertise", type: "text" },
            { name: "experience", label: "Years of Experience", type: "number" },
          ].map(({ name, label, type }) => (
            <label key={name} className="block">
              <span className="text-gray-800 text-lg font-semibold">{label}:</span>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full mt-3 p-4 bg-white text-gray-700 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-pink-500 focus:outline-none transition-transform transform hover:scale-105"
              />
            </label>
          ))}

          <label className="block">
            <span className="text-gray-800 text-lg font-semibold">Brief Bio:</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              className="w-full mt-3 p-4 bg-white text-gray-700 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none transition-transform transform hover:scale-105"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white py-4 px-8 rounded-xl shadow-lg hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-500 transition-transform transform hover:scale-105"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeTutorForm;

