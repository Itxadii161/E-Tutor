import React from 'react';

const PendingTutors = ({ tutors, onApprove, onReject }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-orange-600 mb-4">Pending Tutor Requests</h3>

      {tutors.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No pending tutors at the moment.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tutors.map((tutor) => (
            <li
              key={tutor._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4"
            >
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {tutor.fullName || `${tutor.firstName} ${tutor.lastName}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tutor.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tutor.phoneNumber || 'N/A'}</p>
              </div>
              <div className="mt-3 sm:mt-0 flex space-x-3">
                <button
                  onClick={() => onApprove(tutor._id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(tutor._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingTutors;
