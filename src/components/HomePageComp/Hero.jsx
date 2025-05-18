import React,{useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/Home-page-images/heroImage.png';
import {UserContext} from '../../context/UserContext'
import { FiUsers } from 'react-icons/fi';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext)
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-white">
      {/* Text Content */}
      <div className="w-full md:w-[80%] text-center md:text-left space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          Learn with Experts <br className="hidden md:block" /> Anytime, Anywhere
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto md:mx-0">
          Find top courses and learn from professionals at your own pace.
        </p>
        {user ? (
  <button
    onClick={() => navigate('/find-tutors')}
    className="mx-auto md:mx-0 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 text-sm sm:text-base font-semibold"
  >
    <FiUsers className="text-white text-lg sm:text-xl" />
    <span>Find Tutors</span>
  </button>
) : (
  <button
    onClick={() => navigate('/signup-page')}
    className="mx-auto md:mx-0 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 text-sm sm:text-base font-semibold"
  >
    <span className="text-lg">🚀</span>
    <span>Create Account</span>
  </button>
)}

      </div>

      {/* Image */}
      <div className="w-full  mt-10 md:-mt-0 flex justify-center md:-mr-32">
        <div className="w-4/5 sm:w-3/4 md:w-full max-w-sm p-2 sm:p-4 rounded-2xl border border-orange-100 shadow-md md:shadow-none md:border-0 md:p-0 bg-white">
          <img
            src={heroImage}
            alt="Learning"
            className="w-full rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
