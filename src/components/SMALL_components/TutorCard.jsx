import React, { useContext, useEffect, useState } from 'react';
import { FiStar, FiMapPin, FiDollarSign, FiAward, FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating'; // Adjust path as needed
import { getUserData, rateTutor } from '../../api/apiService'; // Use your actual API service
import { UserContext } from '../../context/UserContext'; // Adjust path

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(tutor.averageRating || 0);
  const [ratingCount, setRatingCount] = useState(tutor.ratingCount || 0);
  const [hasRatedBefore, setHasRatedBefore] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUser = async () => {
      try {
        const currentUser = await getUserData();
        setUser(currentUser);

        // If rating exists in user's ratings
        const previousRating = currentUser?.givenRatings?.find(
          (r) => r.tutorId === tutor._id
        );
        if (previousRating) {
          setUserRating(previousRating.rating);
          setHasRatedBefore(true);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUser();
  }, [tutor._id]);

  const handleRatingChange = async (newRating) => {
    if (!user) return alert('Login required to rate.');
    if (user._id === tutor._id) return alert("You can't rate yourself.");

    try {
      await rateTutor(tutor._id, newRating);
      setUserRating(newRating);
      setHasRatedBefore(true);

      // Update average logic (basic approximation)
      if (!hasRatedBefore) {
        const newCount = ratingCount + 1;
        const updatedAverage = ((averageRating * ratingCount + newRating) / newCount).toFixed(1);
        setAverageRating(Number(updatedAverage));
        setRatingCount(newCount);
      } else {
        // Optional: re-fetch average from backend for precise accuracy
        console.log('Rating updated.');
      }
    } catch (error) {
      console.error('Failed to rate tutor:', error);
      alert('Could not submit rating.');
    }
  };

  const handleViewProfile = () => {
    navigate(`/tutorprofile/${tutor._id}`);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <img
          src={tutor.image || '/default-profile.png'}
          alt={tutor.fullName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{tutor.fullName}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <FiMapPin className="mr-1" />
            {`${tutor.address?.country || ''},${tutor.address?.state || ''}, ${tutor.address?.city || ''},${tutor.address?.village || ''}` || 'N/A'}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 space-y-2">
        <div className="flex items-center">
          <FiBook className="mr-2 text-indigo-600" />
          <span>{tutor.subjectsOfExpertise?.join(', ') || 'Subjects not listed'}</span>
        </div>

        <div className="flex items-center">
          <FiAward className="mr-2 text-indigo-600" />
          <span>{tutor.experienceYears || 0} years of experience</span>
        </div>

        <div className="flex items-center">
          <FiDollarSign className="mr-2 text-indigo-600" />
          <span>${tutor.hourlyRate}/hr</span>
        </div>

        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <FiStar className="text-yellow-500" />
            <span className="text-sm text-gray-700 font-medium">
              {averageRating.toFixed(1)} ({ratingCount} ratings)
            </span>
          </div>

          {/* Conditional Star Rating */}
          {user && user._id !== tutor._id && (
            <div className="mt-1">
              <StarRating
                rating={userRating || 0}
                onRate={handleRatingChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                {userRating ? `You rated: ${userRating}` : 'Click to rate'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleViewProfile}
          className="text-indigo-600 font-medium hover:underline text-sm"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TutorCard;
