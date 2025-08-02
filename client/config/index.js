const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.onrender.com' 
    : 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();