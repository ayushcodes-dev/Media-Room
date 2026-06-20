import axios from "axios";

// Ensure Axios passes cookies/headers globally
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_Backend_SERVER_API_BASE_URL,
  withCredentials: true,
  
});

export default api;
