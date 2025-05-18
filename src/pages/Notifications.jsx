import React, { useEffect, useState } from 'react';
import {
  getUserNotifications,
  acceptHireRequest,
  rejectHireRequest,
  getUserData,
} from '../api/apiService';
import { FiCheck, FiX } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userResponse = await getUserData();
      setUserId(userResponse.user._id);
      const notificationsResponse = await getUserNotifications();
      setNotifications(notificationsResponse);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (notificationId, senderId, action) => {
    try {
      setUpdatingId(notificationId);
      
      // Add verification step
      const response = await (action === 'accept' 
        ? acceptHireRequest(senderId) 
        : rejectHireRequest(senderId));
      
      // Verify backend actually changed status
      if (response.status !== (action === 'accept' ? 'accepted' : 'rejected')) {
        throw new Error(`Backend returned unexpected status: ${response.status}`);
      }
  
      // Only update UI after successful backend confirmation
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? {
                ...notif,
                relatedEntity: {
                  ...notif.relatedEntity,
                  status: response.status,
                  _id: response.requestId // Ensure we have latest ID
                }
              }
            : notif
        )
      );
  
      // Force refresh of hire button status
      if (action === 'reject') {
        // You might need to trigger a global state update or event here
        // depending on your architecture
        window.dispatchEvent(new Event('hire-status-changed'));
      }
  
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      // Revert optimistic update
      setNotifications(prev => [...prev]);
    } finally {
      setUpdatingId(null);
    }
  };

  const getSenderName = (sender) => {
    if (!sender) return 'Unknown User';
    return (
      sender.fullName ||
      `${sender.firstName || ''} ${sender.lastName || ''}`.trim() ||
      sender.email ||
      'Unknown User'
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Map to keep only latest hire-request per sender
  const latestRequestMap = {};
  notifications.forEach((notif) => {
    if (notif.type === 'hire-request') {
      const senderId = notif.sender?._id;
      if (!latestRequestMap[senderId] || new Date(notif.createdAt) > new Date(latestRequestMap[senderId].createdAt)) {
        latestRequestMap[senderId] = notif;
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No notifications found</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            const status = notif.relatedEntity?.status || notif.status || 'unread';
            const isRecipient = notif.recipient?._id?.toString() === userId?.toString();

            // Only show buttons for the latest hire request notification for this sender and if pending
            const isLatestHireRequest = latestRequestMap[notif.sender?._id]?._id === notif._id;
            const isPending = status === 'pending' && isLatestHireRequest;
            const isUpdating = updatingId === notif._id;

            return (
              <div
                key={notif._id}
                className={`p-4 rounded-lg border ${
                  status === 'accepted'
                    ? 'border-green-200 bg-green-50'
                    : status === 'rejected'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={notif.sender?.image || '/default-avatar.png'}
                    alt="Sender"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {notif.type === 'hire-request'
                          ? `Hire request from ${getSenderName(notif.sender)}`
                          : `Notification: ${notif.message || 'New notification'}`}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {notif.type === 'hire-request' && isPending && isRecipient && (
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() =>
                        handleResponse(notif._id, notif.sender._id, 'reject')
                      }
                      disabled={isUpdating}
                      className={`flex items-center gap-1 px-3 py-1 rounded ${
                        isUpdating ? 'bg-gray-200' : 'bg-red-100 hover:bg-red-200'
                      }`}
                    >
                      <FiX /> Reject
                    </button>
                    <button
                      onClick={() =>
                        handleResponse(notif._id, notif.sender._id, 'accept')
                      }
                      disabled={isUpdating}
                      className={`flex items-center gap-1 px-3 py-1 rounded ${
                        isUpdating ? 'bg-gray-200' : 'bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      <FiCheck /> Accept
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
