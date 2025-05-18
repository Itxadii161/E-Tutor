import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Login or Create Account',
      description: 'To begin, either log in to your existing account or create a new one to get started.',
    },
    {
      title: 'Become a Tutor',
      description: 'After logging in, fill out a short form to apply as a tutor and showcase your skills.',
    },
    {
      title: 'Build Your Profile',
      description: 'Personalize your profile with details about your teaching style and expertise.',
    },
    {
      title: 'Start Earning',
      description: 'Once your profile is set, students can find and book sessions with you, and you start earning!',
    },
  ];

  const studentSteps = [
    {
      title: 'Login',
      description: 'Log in to your account to access a variety of tutors tailored to your learning needs.',
    },
    {
      title: 'Find a Tutor',
      description: 'Browse available tutors and view their profiles, subjects, and ratings to find the perfect match.',
    },
    {
      title: 'Start Learning',
      description: 'Connect with your tutor, schedule your sessions, and begin your learning journey.',
    },
  ];

  const renderSteps = (data) =>
    data.map((step, index) => (
      <div
        key={index}
        className="bg-white hover:shadow-xl transition-all duration-300 p-6 rounded-lg shadow flex items-start gap-4"
      >
        <div className="w-12 h-12 min-w-[3rem] bg-[#FF6636] text-white font-bold rounded-full flex items-center justify-center">
          {index + 1}
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[#FF6636]">{step.title}</h3>
          <p className="text-gray-700 mt-2 text-sm md:text-base">{step.description}</p>
        </div>
      </div>
    ));

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-6xl mx-auto bg-white text-gray-800 shadow-xl rounded-2xl px-6 md:px-12 py-10 md:py-16 space-y-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#FF6636]">
          How It Works
        </h1>

        {/* For Tutors */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#FF6636] mb-8">
            For Tutors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {renderSteps(steps)}
          </div>
        </section>

        {/* For Students */}
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#FF6636] mb-8">
            For Students
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {renderSteps(studentSteps)}
          </div>
        </section>

        <footer className="pt-8 border-t text-center text-sm text-gray-500">
          Made to help you learn and teach better — quickly and easily.
        </footer>
      </div>
    </div>
  );
};

export default HowItWorks;
