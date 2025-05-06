import React, { useState, useContext } from "react";
import { signupUser, googleLogin } from "../api/apiService";
import { UserContext } from "../context/UserContext";
import rightImg from "../assets/signup-page/Saly-1.png";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

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

    const {
      firstName, lastName, username, email, password, confirmPassword, termsAccepted
    } = formData;

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setMessage("You must accept the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const response = await signupUser({
        firstName, lastName, username, email, password, confirmPassword: password, title: "Student"
      });

      if (response?.token) {
        localStorage.setItem('authToken', response.token);
        const user = response.user || { firstName, lastName, username, email, role: 'student', _id: response._id };
        const userRole = user.role;
        setUser(user);
        setRole(userRole);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', user._id);
        navigate("/dashboard");
      } else {
        setMessage(response?.message || "Signup succeeded but no token received.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      const data = await googleLogin(credential);
  
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role || "student");
        localStorage.setItem('userId', data.user._id);
        setUser(data.user);
        setRole(data.user.role || "student");
        navigate('/dashboard');
      } else {
        setMessage("Login succeeded but no token received.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Google login failed. Please try again.");
    }
  };

  const handleLoginFailure = () => {
    alert("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Image */}
      <div className="hidden md:flex items-center justify-center bg-indigo-50">
        <img src={rightImg} alt="Signup Illustration" className="w-3/4 h-auto" />
      </div>

      {/* Right Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
        <div className="max-w-xl w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create your account</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Join us and start your journey.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg" required />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg" required />
            </div>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg" required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg" required />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange}
                className="mt-1 h-4 w-4 border-gray-300 rounded" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="/terms" className="text-indigo-600 underline">Terms & Conditions</a>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full bg-orange-500 text-white font-semibold py-3 rounded-lg transition hover:bg-orange-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {message && (
              <p className={`text-center text-sm mt-3 ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="flex flex-col items-center gap-4">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                useOneTap
              />
              <p className="text-xs text-gray-400 text-center">
                By logging in, you agree to our <a href="/terms" className="text-blue-500">Terms</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
              </p>
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
