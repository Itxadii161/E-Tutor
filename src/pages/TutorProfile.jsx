import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutorById, rateTutor, checkUserRating, hireTutor } from '../api/apiService';
import StarRating from '../components/SMALL_components/StarRating';
import { FiArrowLeft } from 'react-icons/fi'; // For back button icon

const TutorProfile = ({ currentUserId }) => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      const data = await getTutorById(tutorId);
      setAvgRating(parseFloat(data.avgRating) || 0);
      setRatingsCount(parseInt(data.totalRatings) || 0);

      if (currentUserId) {
        const ratingData = await checkUserRating(tutorId, currentUserId);
        setUserRating(parseInt(ratingData.rating) || 0);
      }

      setTutor(data);
    };

    fetchTutor();
  }, [tutorId, currentUserId]);

  const handleRate = async (rating) => {
    setUserRating(rating);
    try {
      const response = await rateTutor(tutorId, rating);
      if (response.success) {
        setUserRating(rating);
        setAvgRating(parseFloat(response.tutor.avgRating));
        setRatingsCount(parseInt(response.tutor.totalRatings));
        setSubmissionMessage('Rating submitted successfully!');
      }
    } catch (error) {
      console.error('Rating failed:', error);
      setSubmissionMessage('Failed to submit rating. Please try again.');
    }
  };

  const handleHire = async () => {
    try {
      await hireTutor(tutorId);
      alert('Hiring request sent successfully!');
    } catch (err) {
      console.error('Hiring failed', err);
      alert('Failed to send hiring request.');
    }
  };

  if (!tutor) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading tutor profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6 text-lg font-medium">
        <FiArrowLeft className="mr-3 text-xl" />
        Back to Tutors
      </button>

      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Tutor Image */}
        <img
          src={tutor.image || '/default-avatar.png'}
          alt="Tutor"
          className="w-48 h-48 rounded-full object-cover border-4 border-gray-300 shadow-lg"
        />
        
        {/* Tutor Info */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-semibold text-gray-900 mb-2">{tutor.fullName}</h2>
          <p className="text-lg text-gray-600">Degree:{tutor.highestQualification}</p>
          <p className="text-gray-500 text-sm">Department:{tutor.subjectsOfExpertise?.join(', ')}</p>

          {/* Star Rating */}
          <div className="mt-4">
            <StarRating rating={userRating} onRate={handleRate} />
            <div className="mt-2 text-sm text-gray-600">
              {ratingsCount > 0 ? (
                <>
                  <span className="font-semibold text-lg">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-500"> ({ratingsCount} {ratingsCount === 1 ? 'rating' : 'ratings'})</span>
                </>
              ) : (
                <span className="text-gray-400 italic">No ratings yet</span>
              )}
            </div>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div className="mt-2 text-sm text-green-600">
              {submissionMessage}
            </div>
          )}
        </div>
      </div>

      {/* About, Experience, and Location Sections */}
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="font-semibold text-xl text-gray-800">About</h3>
          <p className="text-gray-700">{tutor.bio || 'No bio available'}</p>
        </div>

        <div>
          <h3 className="font-semibold text-xl text-gray-800">Experience</h3>
          <p className="text-gray-700">{tutor.experience || 'No experience provided'}</p>
        </div>

        <div>
          <h3 className="font-semibold text-xl text-gray-800">Location</h3>
          <p className="text-gray-700">{tutor.city}, {tutor.state}</p>
        </div>
      </div>

      {/* Hire and Message Buttons */}
      <div className="flex justify-center lg:justify-start space-x-6 mt-8">
        <button
          onClick={handleHire}
          className="bg-green-600 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Hire Tutor
        </button>
        <button
          onClick={() => navigate(`/chat/${tutor._id}`)}
          className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default TutorProfile;
