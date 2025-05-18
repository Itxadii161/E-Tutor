import React, { useState, useEffect } from 'react';
import UserTable from './UserTable';
import PendingTutors from './PendingTutors';
import UserDetailsModal from './UserDetailsModal';
import {
  getAllUsers,
  deleteUser,
  getPendingTutors,
  processTutorRequest,
} from '../../api/apiService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({
    students: 0,
    tutors: 0,
    pendingTutors: 0,
  });
  const [pendingTutors, setPendingTutors] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchPendingTutors();
  }, []);

  const fetchUsers = async (role = null) => {
    setLoading(true);
    try {
      const response = await getAllUsers(role);
      setUsers(response.users);
      setCounts(response.counts);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTutors = async () => {
    try {
      const response = await getPendingTutors();
      setPendingTutors(response.pendingTutors);
    } catch (error) {
      console.error('Error fetching pending tutors:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers(
          activeTab === 'students'
            ? 'Student'
            : activeTab === 'tutors'
            ? 'Tutor'
            : null
        );
        fetchPendingTutors();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleProcessRequest = async (userId, action) => {
    try {
      await processTutorRequest(userId, action);
      fetchUsers();
      fetchPendingTutors();
    } catch (error) {
      console.error('Error processing tutor request:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-8">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Students</h3>
          <p className="text-5xl font-bold text-orange-600 mb-4">{counts.students}</p>
          <button
            onClick={() => setActiveTab('students')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            View All
          </button>
        </div>

        {/* Tutors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Tutors</h3>
          <p className="text-5xl font-bold text-green-600 mb-4">{counts.tutors}</p>
          <button
            onClick={() => setActiveTab('tutors')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            View All
          </button>
        </div>

        {/* Pending Tutors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Pending Tutors</h3>
          <p className="text-5xl font-bold text-yellow-500 mb-4">{counts.pendingTutors}</p>
          <button
            onClick={() => setActiveTab('pending')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            View All
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-300 dark:border-gray-700">
        <nav className="flex space-x-6">
          {['students', 'tutors', 'pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors ${
                activeTab === tab
                  ? 'border-b-4 border-orange-600 text-orange-600'
                  : 'border-b-4 border-transparent text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-500'
              }`}
            >
              {tab === 'students'
                ? 'Students'
                : tab === 'tutors'
                ? 'Tutors'
                : 'Pending Tutor Requests'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'students' && (
          <UserTable
            users={users.filter((u) => u.role === 'Student')}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        )}
        {activeTab === 'tutors' && (
          <UserTable
            users={users.filter((u) => u.role === 'Tutor')}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteUser}
            loading={loading}
          />
        )}
       {activeTab === 'pending' && (
          <PendingTutors
            tutors={pendingTutors}
            onApprove={(id) => handleProcessRequest(id, 'approve')}
            onReject={(id) => handleProcessRequest(id, 'reject')}
            loading={loading}
          />
        )}

      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default AdminDashboard;
