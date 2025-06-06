import becomeInstructorImage from '../../../src/assets/Home-page-images/Become an Instructor.png';

const BecomeInstructor = () => {
  const colorMap = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
  };

  return (
    <div className="bg-gray-50 py-8 px-3 sm:py-12 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

        {/* ✅ Left Card - Image with overlay */}
        <div className="relative rounded-lg overflow-hidden aspect-[16/10] md:aspect-auto md:h-full">
          <img
            src={becomeInstructorImage}
            alt="Instructor teaching"
            className="absolute inset-0 w-full h-full object-cover object-right"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center px-4 sm:px-8 lg:px-12">
            <div className="z-10 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                Become An Instructor
              </h2>
              <p className="text-gray-200 mb-4 sm:mb-6 max-w-md text-sm sm:text-base leading-snug">
                Teach millions of students worldwide with our powerful tools and support system.
              </p>
              <button className="bg-white text-[#FF6636] rounded-md px-5 py-2 text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors">
                Start Teaching Today
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Right Card - Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 flex flex-col justify-center h-full">
          <h3 className="text-lg xs:text-xl font-bold text-gray-800 mb-4 xs:mb-6">Your Teaching Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              { num: 1, color: 'blue', text: 'Login or Signup First', desc: 'Simple application' },
              { num: 2, color: 'pink', text: 'Apply to instructor', desc: 'Showcase skills' },
              { num: 3, color: 'red', text: 'Build your profile', desc: 'Easy tools' },
              { num: 4, color: 'green', text: 'Start earning', desc: 'Global reach' }
            ].map((step) => (
              <div key={step.num} className="flex items-start space-x-3">
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-medium
                    ${colorMap[step.color].bg} ${colorMap[step.color].text}`}
                >
                  {step.num}
                </span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm xs:text-base">{step.text}</p>
                  <p className="text-gray-500 text-xs xs:text-sm mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BecomeInstructor;
