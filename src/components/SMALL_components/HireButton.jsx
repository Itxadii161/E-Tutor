import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  sendHireRequest, 
  cancelHireRequest, 
  checkHireStatus, 
  getUserData,
  createOrGetConversation
} from '../../api/apiService';
import { FiMessageSquare } from 'react-icons/fi';

const HireButton = ({ tutorId, tutorFirstName, tutorLastName, tutorImage }) => {
  const [status, setStatus] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStatusChange = () => {
      fetchHireStatus();
    };
    
    window.addEventListener('hire-status-changed', handleStatusChange);
    return () => {
      window.removeEventListener('hire-status-changed', handleStatusChange);
    };
  }, []);

  const fetchHireStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getUserData();
      const user = response.user;
  
      if (user._id?.toString() === tutorId?.toString()) {
        setIsOwnProfile(true);
        return;
      }
  
      const result = await checkHireStatus(tutorId);
      setStatus(result.status || null);
    } catch (error) {
      console.error('Failed to check hire status:', error);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      
      // Get fresh status with error handling
      let currentStatus;
      try {
        const { status } = await checkHireStatus(tutorId);
        currentStatus = status;
      } catch (error) {
        console.error('Status check failed, assuming no active request');
        currentStatus = null;
      }
  
      // Handle different states
      if (!currentStatus || ['rejected', 'cancelled', 'superseded'].includes(currentStatus)) {
        try {
          const response = await sendHireRequest(tutorId);
          if (response?.status === 'pending') {
            setStatus('pending');
            // Refresh all related components
            window.dispatchEvent(new CustomEvent('hire-status-update', {
              detail: { tutorId, status: 'pending' }
            }));
          }
        } catch (error) {
          if (error.response?.data?.error?.includes('Active request exists')) {
            // If we got out of sync, refresh and show message
            await fetchHireStatus();
            alert('Please wait - processing existing request');
            return;
          }
          throw error;
        }
      } else if (currentStatus === 'pending') {
        await cancelHireRequest(tutorId);
        setStatus(null);
        window.dispatchEvent(new CustomEvent('hire-status-update', {
          detail: { tutorId, status: null }
        }));
      } else if (currentStatus === 'accepted') {
        const conversation = await createOrGetConversation(tutorId);
        navigate(`/chat/${tutorId}`, {
          state: {
            tutor: {
              _id: tutorId,
              firstName: tutorFirstName,
              lastName: tutorLastName,
              image: tutorImage,
              fullName: `${tutorFirstName} ${tutorLastName}`,
            },
            conversationId: conversation._id
          }
        });
      }
    } catch (error) {
      console.error('Action failed:', error);
      // Show user-friendly error
      alert('Operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add event listener for external status updates
  useEffect(() => {
    const handleStatusUpdate = (e) => {
      if (e.detail.tutorId === tutorId) {
        setStatus(e.detail.status);
      }
    };
  
    window.addEventListener('hire-status-update', handleStatusUpdate);
    return () => {
      window.removeEventListener('hire-status-update', handleStatusUpdate);
    };
  }, [tutorId]);

  useEffect(() => {
    if (tutorId) {
      fetchHireStatus();
    }
  }, [tutorId]);

  if (isOwnProfile) return null;

  const getButtonLabel = () => {
    if (status === 'pending') return 'Cancel';
    if (status === 'accepted') return <><FiMessageSquare /> Message</>;
    return 'Hire';
  };

  const getButtonColor = () => {
    if (status === 'pending') return 'bg-yellow-500 hover:bg-yellow-600';
    if (status === 'accepted') return 'bg-green-600 hover:bg-green-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`flex items-center gap-1 text-white px-4 py-2 rounded ${getButtonColor()} ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Loading...' : getButtonLabel()}
      </button>
    </div>
  );
};

export default HireButton;