import axios from 'axios';

// Esta es la URL que te da Render (sin el slash / al final)
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://proactive-backend-6omd.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;