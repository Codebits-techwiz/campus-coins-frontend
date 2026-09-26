import axios from 'axios';

// The backend is running on port 3001 by default
// In production, Vite injects VITE_API_URL
// If VITE_API_URL is missing, we use window.location.hostname so it works across local IPs automatically
const baseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;

const api = axios.create({
  baseURL,

  withCredentials: true,
});

export default api;
