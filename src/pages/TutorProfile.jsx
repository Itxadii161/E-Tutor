import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutorById, hireTutor } from '../api/apiService';
import { FiArrowLeft } from 'react-icons/fi';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const data = await getTutorById(id);
        setTutor(data);
      } catch (err) {
        console.error('Failed to fetch tutor:', err);
      }
    };
    fetchTutor();
  }, [id]);

  const handleHire = async () => {
    try {
      await hireTutor(tutor._id);
      alert('Hiring request sent successfully!');
    } catch (err) {
      console.error('Hiring failed', err);
      alert('Failed to send hiring request.');
    }
  };

  if (!tutor) {
    return <div className="text-center py-20 text-gray-500">Loading Tutor Profile...</div>;
  }

  // Check if availability is an object with days and timeSlots
  const availabilityText = tutor.availability
    ? Array.isArray(tutor.availability.days)
      ? `Available Days: ${tutor.availability.days.join(', ')}`
      : 'Days not specified'
    : 'Availability not specified';

  const timeSlotsText = tutor.availability && Array.isArray(tutor.availability.timeSlots)
    ? `Available Time Slots: ${tutor.availability.timeSlots.join(', ')}`
    : 'Time Slots not specified';

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <FiArrowLeft className="mr-2" /> Back to Tutors
      </button>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Image */}
        <img
          src={tutor.image || '/default-avatar.png'}
          alt="Tutor"
          className="w-40 h-40 rounded-full border-4 object-cover"
        />

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{tutor.fullName}</h1>
          <p className="text-gray-600 mb-2 first-letter:capitalize ">Gender: {tutor.gender}</p>
          <p className="text-gray-600 mb-2">Qualification: {tutor.highestQualification}</p>
          <p className="text-sm text-gray-500">Subjects: {tutor.subjectsOfExpertise?.join(', ')}</p>
          <p className="text-sm text-gray-500">Hourly Rate: ₹{tutor.hourlyRate}</p>
          <p className="text-sm text-gray-500">Location: {`${tutor.address?.country || ''},${tutor.address?.state || ''}, ${tutor.address?.city || ''},${tutor.address?.village || ''}` || 'N/A'}</p>
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

        {/* Availability Section */}
        <div>
          <h2 className="text-xl font-semibold">Availability</h2>
          <p className="text-gray-700">{availabilityText}</p>
          <p className="text-gray-700">{timeSlotsText}</p>
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-xl font-semibold">Documents</h2>
          <div className="flex flex-col space-y-2 mt-2">
            {tutor.resumeUrl && (
              <a href={tutor.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                📄 View Resume
              </a>
            )}

            {Array.isArray(tutor.educationCertificates) && tutor.educationCertificates.length > 0 && (
              tutor.educationCertificates.map((cert, i) => (
                <a key={i} href={cert} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  📘 View Certificate {i + 1}
                </a>
              ))
            )}

            {tutor.idProofUrl && (
              <a href={tutor.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                🪪 View ID Proof
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleHire}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
        >
          Hire Tutor
        </button>
        <button
          onClick={() => navigate(`/chat/${tutor._id}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default TutorProfile;
