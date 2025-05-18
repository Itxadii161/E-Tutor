import React from 'react';

const UserDetailsModal = ({ user, show, onHide, onDelete }) => {
  if (!user || !show) return null;

  const roleBadgeColor = {
    Tutor: 'bg-green-600',
    'Pending-Tutor': 'bg-yellow-500',
    Student: 'bg-blue-600',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onHide}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full p-6 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center border-b border-gray-300 pb-3">
          <h2 className="text-2xl font-semibold text-orange-600">User Details</h2>
          <button 
            onClick={onHide} 
            className="text-gray-700 hover:text-orange-600 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <div className="mt-5">
          <nav className="flex border-b border-gray-200">
            <button
              className="py-2 px-4 text-orange-600 border-b-2 border-orange-600 font-medium"
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            {(user.role === 'Tutor' || user.role === 'Pending-Tutor') && (
              <button
                className="py-2 px-4 text-gray-600 hover:text-orange-600 border-b-2 border-transparent hover:border-orange-600 font-medium"
                onClick={() => setActiveTab('tutor')}
              >
                Tutor Info
              </button>
            )}
          </nav>

          {/* We'll manage tab content with local state */}
          <TabContent user={user} />
        </div>

        <footer className="flex justify-end gap-3 mt-6 border-t border-gray-300 pt-4">
          <button
            onClick={onHide}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Close
          </button>
          <button
            onClick={() => { onDelete(user._id); onHide(); }}
            className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Delete User
          </button>
        </footer>
      </div>
    </div>
  );
};

const TabContent = ({ user }) => {
  const [activeTab, setActiveTab] = React.useState('personal');

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-gray-800 dark:text-gray-100">
      <div>
        <p><span className="font-semibold">Full Name:</span> {user.fullName || `${user.firstName} ${user.lastName}`}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Username:</span> {user.username}</p>
        <p>
          <span className="font-semibold">Role:</span> 
          <span className={`ml-2 inline-block px-2 py-0.5 rounded text-white text-sm ${
            user.role === 'Tutor' ? 'bg-green-600' :
            user.role === 'Pending-Tutor' ? 'bg-yellow-500' :
            'bg-blue-600'
          }`}>
            {user.role}
          </span>
        </p>
      </div>
      <div>
        <p><span className="font-semibold">Date of Birth:</span> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
        <p><span className="font-semibold">Gender:</span> {user.gender || 'N/A'}</p>
        <p><span className="font-semibold">Phone:</span> {user.phoneNumber || 'N/A'}</p>
      </div>
      <div className="md:col-span-2">
        <p><span className="font-semibold">Address:</span> {user.address ? `${user.address.city}, ${user.address.country}` : 'N/A'}</p>
      </div>
    </div>
  );

  const renderTutorInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-gray-800 dark:text-gray-100">
      <div>
        <p><span className="font-semibold">Highest Qualification:</span> {user.highestQualification || 'N/A'}</p>
        <p><span className="font-semibold">Institution:</span> {user.institutionName || 'N/A'}</p>
        <p><span className="font-semibold">Graduation Year:</span> {user.graduationYear || 'N/A'}</p>
      </div>
      <div>
        <p><span className="font-semibold">Experience:</span> {user.experienceYears ? `${user.experienceYears} years` : 'N/A'}</p>
        <p><span className="font-semibold">Hourly Rate:</span> {user.hourlyRate ? `$${user.hourlyRate}` : 'N/A'}</p>
        <p><span className="font-semibold">Teaching Mode:</span> {user.teachingMode?.join(', ') || 'N/A'}</p>
      </div>
      <div className="md:col-span-2">
        <p><span className="font-semibold">Subjects:</span> {user.subjectsOfExpertise?.join(', ') || 'N/A'}</p>
        <p><span className="font-semibold">Certifications:</span> {user.certifications?.join(', ') || 'N/A'}</p>
        <p><span className="font-semibold">Availability:</span> {user.availability?.days?.join(', ') || 'N/A'}</p>
        <p><span className="font-semibold">Time Slots:</span> {user.availability?.timeSlots?.join(', ') || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div>
      {activeTab === 'personal' && renderPersonalInfo()}
      {activeTab === 'tutor' && renderTutorInfo()}
    </div>
  );
};

export default UserDetailsModal;
