import React from "react";
import illustration from '../assets/signin-page/Illustrations.png'
const SignInPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section - Illustration */}
      <div className="flex-1 flex justify-center items-center bg-blue-100">
        <img src={illustration} alt="Illustration" className="max-w-md" />
      </div>
      
      {/* Right Section - Sign In Form */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-96 p-8 shadow-lg rounded-lg border">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign in to your account</h2>
          
          <form>
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="text"
              placeholder="Username or email address..."
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-700">Remember me</label>
              </div>
            </div>
            
            <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Sign in →</button>
          </form>
          
          <div className="text-center my-4 text-gray-500">SIGN IN WITH</div>
          
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
