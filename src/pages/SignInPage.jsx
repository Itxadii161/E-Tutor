import React, { useState, useContext } from "react";
import { loginUser } from "../api/apiService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/signin-page/Illustrations.png";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setRole, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!email || !password) {
      setMessage("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email, password });
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userRole", response.user.role || 'student');
        localStorage.setItem("userId", response.user._id);
        
        // Update context
        setRole(response.user.role || 'student');
        setUser(response.user);
        
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setMessage(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(
        error.response?.data?.message || 
        error.message || 
        "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Illustration */}
      <div className="flex-1 flex justify-center items-center bg-blue-100">
        <img src={illustration} alt="Illustration" className="max-w-md" />
      </div>

      {/* Right Section - Sign In Form */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-96 p-8 shadow-lg rounded-lg border">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center text-lg ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </div>
          )}

          <div className="text-center my-4 text-gray-500">OR</div>

          <div className="flex justify-center space-x-4">
            <button className="p-2 bg-gray-200 rounded">Google</button>
            <button className="p-2 bg-gray-200 rounded">Facebook</button>
            <button className="p-2 bg-gray-200 rounded">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;