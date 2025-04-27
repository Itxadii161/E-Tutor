import React from "react";
import rightImg from '../assets/signup-page/Saly-1.png'
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 flex items-center justify-center bg-indigo-50 relative">
        <img
          src={rightImg} // Replace with your rocket illustration URL
          alt="Rocket Illustration"
          className="w-[80%] h-auto "
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-12">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Create your account
          </h1>
          <form className="space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex gap-4">
              <input
                type="password"
                placeholder="Create password"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 w-5 h-5 focus:ring-indigo-400"
              />
              <label htmlFor="terms" className="text-gray-600 text-sm">
                I agree with all of your <a className="text-indigo-600">Terms & Conditions</a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              onClick={()=> navigate('/dashboard-page')}
            >
              Create Account
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-between gap-4">
            <button className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200">
              Google
            </button>
            <button className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200">
              Facebook
            </button>
            <button className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200">
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
