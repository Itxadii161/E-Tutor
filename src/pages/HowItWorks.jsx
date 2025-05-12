import React from 'react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r bg-gray-100 px-6 py-16">
      <div className="max-w-6xl mx-auto bg-white text-gray-800 shadow-lg rounded-xl px-8 py-12 space-y-12">
        <h1 className="text-4xl font-semibold text-center text-[#FF6636] mb-8">
          How It Works
        </h1>

        {/* Tutor Flow Section */}
        <section>
          <h2 className="text-3xl font-semibold text-[#FF6636] mb-6">For Tutors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1: Login or Create Account */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Login or Create Account</h3>
                <p className="text-gray-700 mt-2">
                  To begin, either log in to your existing account or create a new one to get started.
                </p>
              </div>
            </div>
            
            {/* Step 2: Become a Tutor */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Become a Tutor</h3>
                <p className="text-gray-700 mt-2">
                  After logging in, fill out a short form to apply as a tutor and showcase your skills.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Step 3: Build Profile */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Build Your Profile</h3>
                <p className="text-gray-700 mt-2">
                  Personalize your profile with details about your teaching style and expertise.
                </p>
              </div>
            </div>

            {/* Step 4: Start Earning */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Start Earning</h3>
                <p className="text-gray-700 mt-2">
                  Once your profile is set, students can find and book sessions with you, and you start earning!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Student Flow Section */}
        <section>
          <h2 className="text-3xl font-semibold text-[#FF6636] mb-6">For Students</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1: Login */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Login</h3>
                <p className="text-gray-700 mt-2">
                  Log in to your account to access a variety of tutors tailored to your learning needs.
                </p>
              </div>
            </div>

            {/* Step 2: Find a Tutor */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Find a Tutor</h3>
                <p className="text-gray-700 mt-2">
                  Browse available tutors and view their profiles, subjects, and ratings to find the perfect match.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Step 3: Start Learning */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-6">
              <div className="w-12 h-12 bg-[#FF6636] rounded-full text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#FF6636]">Start Learning</h3>
                <p className="text-gray-700 mt-2">
                  Connect with your tutor, schedule your sessions, and begin your learning journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-6 border-t text-center">
          <p className="text-sm text-gray-500">Made to help you learn and teach better — quickly and easily.</p>
        </footer>
      </div>
    </div>
  );
};

export default HowItWorks;
