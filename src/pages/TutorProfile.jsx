import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutorById } from '../api/apiService';
import { FiArrowLeft } from 'react-icons/fi';
import HireButton from '../components/SMALL_components/HireButton';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setIsLoading(true);
        const data = await getTutorById(id);
        setTutor(data);
      } catch (err) {
        console.error('Failed to fetch tutor:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTutor();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading Tutor Profile...</div>;
  }

  if (!tutor) {
    return <div className="text-center py-20 text-gray-500">Tutor not found.</div>;
  }

  const availabilityText = tutor.availability?.isAvailable
    ? 'Available for tutoring'
    : 'Not available currently';

  const timeSlotsText = tutor.availability?.timeSlots?.length
    ? `Time Slots: ${tutor.availability.timeSlots.join(', ')}`
    : 'No specific time slots provided';

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FiArrowLeft className="mr-2" /> Back to Tutors
      </button>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        <img
          src={tutor.image || '/default-avatar.png'}
          alt="Tutor"
          className="w-40 h-40 rounded-full border-4 border-gray-100 object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{tutor.fullName}</h1>
          <p className="text-gray-600 mb-2 capitalize">Gender: {tutor.gender}</p>
          <p className="text-gray-600 mb-2">Qualification: {tutor.highestQualification}</p>
          <p className="text-sm text-gray-500">Subjects: {tutor.subjectsOfExpertise?.join(', ')}</p>
          <p className="text-sm text-gray-500">Hourly Rate: ₹{tutor.hourlyRate}</p>
          <p className="text-sm text-gray-500">
            Location: {`${tutor.address?.country || ''}, ${tutor.address?.state || ''}, ${tutor.address?.city || ''}, ${tutor.address?.village || ''}`}
          </p>

          <HireButton 
            tutorId={tutor._id} 
            tutorFirstName={tutor.firstName}
            tutorLastName={tutor.lastName}
            tutorImage={tutor.image}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <div>
          <h2 className="text-xl font-semibold">About</h2>
          <p className="text-gray-700">{tutor.bio || 'No bio provided'}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Experience</h2>
          <p className="text-gray-700">{tutor.experienceYears} years</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Institutions</h2>
          <p className="text-gray-700 italic">{tutor.pastInstitutions}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="text-gray-700">{availabilityText}</p>
          <p className="text-gray-700">{timeSlotsText}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <div className="flex flex-col space-y-2 mt-2">
            {tutor.resumeUrl && (
              <a href={tutor.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                📄 View Resume
              </a>
            )}
            {Array.isArray(tutor.educationCertificates) &&
              tutor.educationCertificates.map((cert, i) => (
                <a key={i} href={cert} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  📘 View Certificate {i + 1}
                </a>
              ))}
            {tutor.idProofUrl && (
              <a href={tutor.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                🪪 View ID Proof
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;