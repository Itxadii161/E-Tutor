import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Generic API request handler
const apiReq = async (endpoint, method = 'GET', data = null, customConfig = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(customConfig.headers || {}),
      },
      data,
      ...customConfig,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API request failed', error.response?.data || error.message);
    throw error.response?.data?.message || 
      error.message || 
      'API request failed';
  }
};

// 🧑‍🎓 Auth and Profile
const signupUser = async (formData) => {
  return await apiReq('/users/signup', 'POST', formData);
};

const loginUser = async (formData) => {
  return await apiReq('/users/login', 'POST', formData);
};

const googleLogin = async (credential) => {
  return await apiReq('/users/google-login', 'POST', { credential });
};

const getUserData = async () => {
  return await apiReq('/users/getUser', 'GET');
};

// Update Profile
const updateProfile = async (formData) => {
  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: (data) => data, // Important for FormData
  };
  return await apiReq('/users/update-profile', 'PUT', formData, config);
};

const changePassword = async (formData) => {
  return await apiReq('/users/change-password', 'PUT', formData);
};

const getUserRole = async (token) => {
  return await apiReq('/users/getUserRole', 'GET', null, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// ========== Tutor-Related API Functions ========== //

/**
 * Apply to become a tutor
 * @param {FormData} formData - Tutor application data including documents
 */
const becomeTutor = async (formData) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication required');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data', // commented out is okay, axios sets it automatically for FormData
    },
  };

  return await apiReq('/tutor/become-tutor', 'POST', formData, config);
};

// 📚 Tutor Discovery & Interaction

/**
 * Get all tutors with optional filters
 * @param {Object} filters - Filter criteria
 */
const getAllTutors = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  try {
    const tutors = await apiReq(`/tutor?${params.toString()}`);
    return Array.isArray(tutors) ? tutors : [];
  } catch (error) {
    console.error('Failed to fetch tutors:', error);
    return [];
  }
};

/**
 * Get a specific tutor by ID
 * @param {string} tutorId - ID of the tutor
 */
const getTutorById = async (tutorId) => {
  if (!tutorId) {
    throw new Error('Tutor ID is required');
  }

  try {
    const response = await apiReq(`/tutor/${tutorId}`);
    return response?.tutor;
  } catch (error) {
    console.error(`Error fetching tutor ${tutorId}:`, error);
    throw error;
  }
};


/**
 * Rate a tutor
 * @param {string} tutorId - ID of the tutor to rate
 * @param {number} ratingValue - Rating value (1-5)
 */
const rateTutor = async (tutorId, rating, review = "") => {
  const user = await getUserData(); // Get the current user data here
  return await apiReq('/tutor/rate', 'POST', {
    tutorId,
    userId: user._id, // Pass the user._id here directly
    rating,
    review
  });
};


/**
 * Check if a user is a tutor
 * @param {string} userId - User ID to verify
 */
const verifyTutorStatus = async (userId) => {
  try {
    const user = await apiReq(`/users/${userId}`);
    return user?.role === 'Tutor';
  } catch (error) {
    console.error('Error verifying tutor status:', error);
    return false;
  }
};

// 💬 Chat APIs
 const createOrGetConversation = async (otherUserId) => {
  return await apiReq('/chat/conversation', 'POST', { otherUserId });
};
 const getUserConversations = async () => {
  return await apiReq('/chat/conversations');
};

 const getMessages = async (conversationId) => {
  return await apiReq(`/chat/messages/${conversationId}`);
};

 const sendMessage = async (conversationId, text) => {
  return await apiReq('/chat/messages', 'POST', { conversationId, text });
};


// Hiring related functions
const sendHireRequest = async (tutorId) => {
  return await apiReq('/hire/request', 'POST', { tutorId });
};

const checkHireStatus = async (tutorId) => {
  return await apiReq(`/hire/status/${tutorId}`, 'GET');
};

const cancelHireRequest = async (tutorId) => {
  return await apiReq('/hire/cancel', 'POST', { tutorId });
};

const acceptHireRequest = async (studentId) => {
  return await apiReq('/hire/accept', 'POST', { studentId });
};

const rejectHireRequest = async (studentId) => {
  return await apiReq('/hire/reject', 'POST', { studentId });
};
// Notification APIs
const getUserNotifications = async () => {
  return await apiReq('/hire/notifications', 'GET');
};
const getTutorHireRequests = async () => {
  return await apiReq('/hire/requests', 'GET');
};



export const getAllUsers = async (role = null) => {
  const params = role ? { role } : {};
  const response = await apiReq('/admin/users', 'GET', null, { params });
  return response;
};

export const getUserDetails = async (userId) => {
  const response = await apiReq(`/admin/users/${userId}` ,'GET',);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiReq(`/admin/users/${userId}` , 'DELETE');
  return response.data;
};

export const getPendingTutors = async () => {
  const response = await apiReq('/admin/pending-tutors', 'GET');
  return response
};

export const processTutorRequest = async (userId, action) => {
  const response = await apiReq(`/admin/tutor-requests/${userId}`, 'PUT' ,{ action });
  return response.data;
};

// Become Tutor function
// export const becomeTutor = async (formData) => {
//   const response = await api.put('/users/become-tutor', formData);
//   return response.data;
// };

// Add these to your exports at the bottom
export {
  getUserNotifications,
  sendHireRequest,
  checkHireStatus,
  cancelHireRequest,
  acceptHireRequest,
  rejectHireRequest,
  getTutorHireRequests,

  // Tutor functions
  becomeTutor,
  getAllTutors,
  getTutorById,
  rateTutor,
  verifyTutorStatus,
  
  // Auth functions
  signupUser,
  loginUser,
  googleLogin,
  getUserData,
  updateProfile,
  changePassword,
  getUserRole,
  
  getMessages,
  createOrGetConversation,
  sendMessage,
  getUserConversations

};
