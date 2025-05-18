import React from 'react';

const UserTable = ({ users, onViewDetails }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-orange-50 dark:hover:bg-gray-700 transition"
            >
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                {user.fullName || `${user.firstName} ${user.lastName}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'Tutor'
                      ? 'bg-green-600 text-white'
                      : user.role === 'Pending-Tutor'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                {user.status || 'Active'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(user);
                  }}
                  className="text-orange-600 hover:text-orange-800 font-semibold"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
