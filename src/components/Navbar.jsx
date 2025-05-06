// components/Navbar.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Import context
import logo from '../assets/Home-page-images/logoImage.png'; // Import logo
import { IoSearchOutline } from "react-icons/io5";

const Navbar = () => {
  const { user, logout } = useContext(UserContext); // Destructure logout and user
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center sticky top-12 z-50">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <img src={logo} alt="E-tutor Logo" className="h-8 mr-2" />
          E-tutor
        </Link>
        <div className="relative ml-20 w-[300px]">
          <input
            type="text"
            placeholder="What do you want to learn..."
            className="border rounded-md h-11 pl-10 pr-4 w-full"
          />
          <IoSearchOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {!user ? (
          <>
            <button onClick={() => navigate('/login')} className='text-[#FF6636] bg-[#FFEEE8] p-4 rounded-md h-11 flex items-center font-semibold'>
              Login
            </button>
            <button onClick={() => navigate('/signup-page')} className="bg-[#FF6636] text-white p-4 rounded-md h-11 flex items-center font-semibold">
              Sign Up
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/dashboard')} className="text-[#FF6636] bg-[#FFEEE8] p-4 rounded-md h-11 flex items-center font-semibold">
              Dashboard
            </button>
            <button onClick={logout} className="bg-[#FF6636] text-white p-4 rounded-md h-11 flex items-center font-semibold">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
