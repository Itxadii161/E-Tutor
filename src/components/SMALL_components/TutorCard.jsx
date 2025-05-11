import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaCertificate, FaUniversity, FaClock } from 'react-icons/fa';
import StarRating from './StarRating';  // Make sure you have this StarRating component

const TutorCard = ({ tutor, currentUserId }) => {
  const { user } = useContext(UserContext);  // Assuming you have a UserContext to get the current user
  const navigate = useNavigate();
  const [ratingData, setRatingData] = useState({
    userRating: 0,
    avgRating: 0,
    ratingsCount: 0,
    isLoading: true,
    submissionMessage: ''
  });

  useEffect(() => {
    if (!tutor?._id) {
      console.warn("Tutor object or ID is missing:", tutor);
      return;
    }

    // Simulate fetching tutor data from an API (replace with your actual API logic)
    const fetchTutorData = async () => {
      try {
        // Here you would fetch data like avgRating, totalRatings etc.
        // Assuming the tutor object already has this info for simplicity
        const avgRating = tutor.avgRating || 0;
        const ratingsCount = tutor.ratingsCount || 0;

        setRatingData(prev => ({
          ...prev,
          avgRating,
          ratingsCount,
          isLoading: false
        }));
      } catch (err) {
        console.error('Error:', err);
        setRatingData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchTutorData();
  }, [tutor]);

  const handleRatingChange = async (newRating) => {
    if (!user || user.role === 'Tutor') return;  // Ensure the user is not a tutor

    try {
      // Simulate API call to save the rating (replace with your actual API logic)
      const response = await rateTutor(tutor._id, newRating);  // rateTutor is your API function

      if (response.success) {
        setRatingData(prev => ({
          ...prev,
          userRating: newRating,
          avgRating: response.avgRating,  // New avg rating after submission
          ratingsCount: response.ratingsCount,  // Updated rating count
          submissionMessage: 'Thanks for your rating!'
        }));
      }
    } catch (err) {
      setRatingData(prev => ({
        ...prev,
        submissionMessage: 'Rating failed. Try again.'
      }));
    }
  };

  // If data is still loading, show loading skeleton
  if (ratingData.isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto animate-pulse shadow-md">
        <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-6 w-3/4 bg-gray-200 mx-auto mb-2 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 mx-auto rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <img
          src={tutor.image || '/default-avatar.png'}
          alt={tutor.fullName}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
        />
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start">
            <h2 className="text-xl font-semibold text-gray-800">{tutor.fullName}</h2>
            {tutor.role === 'Tutor' && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                <FaChalkboardTeacher className="mr-1" /> Verified Tutor
              </span>
            )}
          </div>

          <div className="mt-2 space-y-1">
            {tutor.highestQualification && (
              <p className="text-gray-600 text-sm flex items-center">
                <FaUniversity className="mr-2 text-blue-500" />
                {tutor.highestQualification} {tutor.institutionName && `from ${tutor.institutionName}`}
              </p>
            )}
            
            <p className="text-gray-600 text-sm flex items-center">
              <FaCertificate className="mr-2 text-blue-500" />
              {tutor.experienceYears || 0} year{tutor.experienceYears !== 1 ? 's' : ''} experience
              {tutor.certifications?.length > 0 && ` • ${tutor.certifications.length} certification${tutor.certifications.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-gray-500 text-sm">
              <strong>Teaches:</strong> {tutor.subjectsOfExpertise?.join(', ') || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <StarRating
          rating={ratingData.userRating}
          onRate={handleRatingChange}
          disabled={!user || user.role === 'Tutor'} // Disable rating if the user is a tutor or not logged in
        />
        <p className="text-sm text-gray-600 mt-1">
          {ratingData.ratingsCount > 0 ? (
            <>
              <span className="font-semibold">{ratingData.avgRating.toFixed(1)}</span> ({ratingData.ratingsCount}{' '}
              rating{ratingData.ratingsCount > 1 ? 's' : ''})
            </>
          ) : (
            <span className="italic text-gray-400">No ratings yet</span>
          )}
        </p>
        {ratingData.submissionMessage && (
          <p className="text-xs text-green-600 mt-1">{ratingData.submissionMessage}</p>
        )}
      </div>

      <button
        onClick={() => navigate(`/tutorprofile/${tutor._id}`)}
        className="mt-5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition duration-200 shadow"
      >
        View Full Profile
      </button>
    </div>
  );
};

export default TutorCard;
