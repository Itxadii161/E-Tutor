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
      // 'Content-Type': 'multipart/form-data',
    },
  };

  return await apiReq('/tutor/becometutor', 'POST', formData, config);
};

// 💬 Messaging & Hiring
const sendMessage = async (data) => {
  return await apiReq('/messages/send', 'POST', data);
};

const getConversationMessages = async (userId1, userId2) => {
  return await apiReq(`/messages/${userId1}/${userId2}`, 'GET');
};

// Correct API request method for getting conversations
const getUserConversations = async (userId) => {
  try {
    const response = await apiReq(`/messages/conversations/${userId}`, 'GET');
    return response.data; // Ensure the response data is returned
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error; // Propagate the error
  }
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
 * Hire a tutor
 * @param {string} tutorId - ID of the tutor to hire
 * @param {string} message - Optional message to the tutor
 */
const hireTutor = async (tutorId, message = '') => {
  if (!tutorId) throw new Error('Tutor ID is required');
  return await apiReq('/tutor/hire', 'POST', { tutorId, message });
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

// ✅ Export All APIs
export {
  // Tutor functions
  becomeTutor,
  getAllTutors,
  getTutorById,
  rateTutor,
  hireTutor,
  verifyTutorStatus,
  
  // Auth functions
  signupUser,
  loginUser,
  googleLogin,
  getUserData,
  updateProfile,
  changePassword,
  getUserRole,
  
  // Messaging functions
  sendMessage,
  getConversationMessages,
  getUserConversations
};
