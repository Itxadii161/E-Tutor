import React, { useState, useContext } from "react";
import { loginUser, googleLogin } from "../api/apiService";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import illustration from "../assets/signin-page/Illustrations.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setRole, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email, password });

      if (response.success) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userRole", response.user.role || "student");
        localStorage.setItem("userId", response.user._id);

        setRole(response.user.role || "student");
        setUser(response.user);

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

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      const data = await googleLogin(credential);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.user.role || "student");
        localStorage.setItem("userId", data.user._id);

        setRole(data.user.role || "student");
        setUser(data.user);

        navigate("/dashboard");
      } else {
        setMessage("Login succeeded but no token received.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google login failed");
    setMessage("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left - Illustration */}
      <div className="hidden md:flex items-center justify-center bg-blue-100">
        <img src={illustration} alt="Login Illustration" className="w-3/4 h-auto " />
      </div>

      {/* Right - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Sign in to your account</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-500 text-white font-semibold py-3 rounded-lg transition hover:bg-red-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Signing in..." : "Sign in"}
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
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
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

export default Login;
