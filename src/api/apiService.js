import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Generic API request handler
// Enhanced apiReq function
const apiReq = async (endpoint, method = 'GET', data = null, customConfig = {}) => {
  try {
    const token = localStorage.getItem('authToken'); // Or your token storage
    
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
  ...(token && { 'Authorization': `Bearer ${token}` }),
  ...customConfig.headers,
  ...(customConfig.headers?.['Content-Type'] ? {} : { 'Content-Type': 'application/json' })
},

      data,
      ...customConfig // Spread other custom config
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API request failed', error);
    throw error;
  }
};
// User Registration (Sign up)
const signupUser = async (formData) => {
  return await apiReq('/users/signup', 'POST', formData);  // POST request to '/signup' route
};

// User Login
const loginUser = async (formData) => {
  return await apiReq('/users/login', 'POST', formData);  // POST request to '/login' route
};

// Google Login
const googleLogin = async (credential) => {
  return await apiReq('/users/google-login', 'POST', { credential });  // POST request to '/google-login' route
};

// Get User Data (For Authenticated User)
const getUserData = async () => {
  return await apiReq('/users/getUser', 'GET');  // GET request to '/getUser' route
};

// Update Profile
const updateProfile = async (formData) => {
  return await apiReq('/users/update-profile', 'PUT', formData);  // PUT request to '/update-profile' route
};

// Change Password
const changePassword = async (formData) => {
  return await apiReq('/users/change-password', 'PUT', formData);  // PUT request to '/change-password' route
};




const becomeTutor = async (formData) => {
  const form = new FormData();
  const token = localStorage.getItem('authToken');

  console.log("Auth Token used in tutor request:", token);
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
      'Authorization': `Bearer ${token}`
      // DO NOT manually set 'Content-Type' for FormData
    }
  };

  return await apiReq('/becometutor', 'POST', form, config);
};

  // Get the current user's role
const getUserRole = async (token) => {
  return await apiReq('/users/getUserRole', 'GET', null, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};


// Export all functions for use in other parts of the application
export { signupUser, getUserRole, loginUser, googleLogin, getUserData, updateProfile, changePassword, becomeTutor };
