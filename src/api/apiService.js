import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
 export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Generic API request handler
const apiReq = async (endpoint, method = 'GET', data = null, customConfig = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    // console.log(token);
    // console.log("authToken in localStorage:", localStorage.getItem('authToken'));
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(customConfig.headers || {})
      },
      data,
      ...customConfig
    };


    const response = await axios(config);
    return response.data;
  } catch (error) {
    
    console.error('API request failed', error.response?.data || error.message);

    throw error;
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

const updateProfile = async (formData) => {
  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
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
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

// 🎓 Tutor-related
const becomeTutor = async (formData) => {
  const form = new FormData();
  const token = localStorage.getItem('authToken');

  if (!token) {
    alert("No auth token found. Please log in.");
    throw new Error("Missing token");
  }

  for (const key in formData) {
    if (Array.isArray(formData[key])) {
      formData[key].forEach(file => form.append(key, file));
    } else if (formData[key] !== null && formData[key] !== undefined) {
      form.append(key, formData[key]);
    }
  }

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };

  return await apiReq('/becometutor', 'POST', form, config);
};

// 💬 Messaging & Hiring

const sendMessage = async (data) => {
  return await apiReq('/messages/send', 'POST', data);
};

const hireTutor = async (data) => {
  return await apiReq('/messages/hire', 'POST', data);
};

const getConversationMessages = async (userId1, userId2) => {
  return await apiReq(`/messages/${userId1}/${userId2}`, 'GET');
};

// Correct API request method for getting conversations
const getUserConversations = async (userId) => {
  try {
    const response = await apiReq(`/messages/conversations/${userId}`, 'GET');
    return response.data;  // Ensure the response data is returned
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;  // Propagate the error
  }
};


// ✅ Export All APIs
export {
  signupUser,
  loginUser,
  googleLogin,
  getUserData,
  updateProfile,
  changePassword,
  becomeTutor,
  getUserRole,
  sendMessage,
  hireTutor,
  getConversationMessages,
  getUserConversations
};
