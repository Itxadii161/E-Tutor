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

// // 🎓 Tutor-related
// const becomeTutor = async (formData) => {
//   const form = new FormData();
//   const token = localStorage.getItem('authToken');

//   if (!token) {
//     alert("No auth token found. Please log in.");
//     throw new Error("Missing token");
//   }

//   for (const key in formData) {
//     if (Array.isArray(formData[key])) {
//       formData[key].forEach(file => form.append(key, file));
//     } else if (formData[key] !== null && formData[key] !== undefined) {
//       form.append(key, formData[key]);
//     }
//   }

//   const config = {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   };

//   return await apiReq('/tutor/becometutor', 'POST', form, config);
// };

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
 /**
 * Get tutor details by ID
 * @param {string} tutorId - ID of the tutor
 * @param {string} role - ID of the tutor
 */
 const getTutorById = async (tutorId) => {
  try {
    if (!tutorId) throw new Error('Tutor ID is required');

    const response = await apiReq(`/tutor/${tutorId}`);
    const tutor = response?.tutor;

    const role = tutor?.role?.toLowerCase();
    if (!role) {
      throw new Error('No role present');
    }
    if (role !== 'tutor') {
      throw new Error('Requested user is not a tutor');
    }

    return tutor;
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
const rateTutor = async (tutorId, ratingValue) => {
  if (!tutorId) throw new Error('Tutor ID is required');
  if (ratingValue < 1 || ratingValue > 5) throw new Error('Rating must be between 1 and 5');

  return await apiReq('/tutor/rate', 'POST', { tutorId, rating: ratingValue });
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

/**
 * Check a user's rating for a tutor
 * @param {string} tutorId - Tutor ID
 * @param {string} userId - User ID
 */
const checkUserRating = async (tutorId, userId) => {
  try {
    return await apiReq('/tutor/rating-check', 'GET', null, {
      params: { tutorId, userId }
    });
  } catch (error) {
    console.error("Error checking user rating:", error);
    return { rating: 0, exists: false };
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
  checkUserRating,
  
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