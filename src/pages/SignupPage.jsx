import React, { useState, useContext } from "react";
import { signupUser } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import rightImg from "../assets/signup-page/Saly-1.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const { setRole, setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate inputs
    if (!formData.firstName || !formData.lastName || !formData.username || 
        !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted) {
      setMessage("You must accept the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const { firstName, lastName, username, email, password } = formData;
      const response = await signupUser({ 
        firstName, 
        lastName, 
        username, 
        email, 
        password,
        confirmPassword: password, // Send password again as confirmPassword
        title: "Student" // Add default title
      });

      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        
        const userRole = response.user?.role || 'student';
        const userId = response.user?._id || response._id;
        
        setRole(userRole);
        setUser(response.user || {
          firstName,
          lastName,
          username,
          email,
          role: userRole,
          _id: userId
        });
        
        localStorage.setItem('userRole', userRole);
        if (userId) {
          localStorage.setItem('userId', userId);
        }

        navigate("/dashboard");
      } else {
        setMessage(response?.message || "Registration successful but no token received.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message ||
                      "Registration failed. Please try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="flex-1 flex items-center justify-center bg-indigo-50">
        <img src={rightImg} alt="Rocket Illustration" className="w-[80%] h-auto" />
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-12">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Create your account
          </h1>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="flex gap-4">
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="First name" 
                required 
                className="w-1/2 p-3 border border-gray-300 rounded-lg" 
              />
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Last name" 
                required 
                className="w-1/2 p-3 border border-gray-300 rounded-lg" 
              />
            </div>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Username" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg" 
            />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email address" 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg" 
            />
            <div className="flex gap-4">
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Create password" 
                required 
                minLength="6"
                className="w-1/2 p-3 border border-gray-300 rounded-lg" 
              />
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Confirm password" 
                required 
                minLength="6"
                className="w-1/2 p-3 border border-gray-300 rounded-lg" 
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="termsAccepted" 
                checked={formData.termsAccepted} 
                onChange={handleChange} 
                id="terms" 
                className="mr-2 w-5 h-5" 
                required 
              />
              <label htmlFor="terms" className="text-gray-600 text-sm">
                I agree with all of your <a href="/terms" className="text-indigo-600">Terms & Conditions</a>
              </label>
            </div>
            <button 
              type="submit" 
              className={`w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center text-lg ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </div>
          )}

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-between gap-4">
            <button type="button" className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200">
              Google
            </button>
            <button type="button" className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200">
              Facebook
            </button>
            <button type="button" className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200">
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;