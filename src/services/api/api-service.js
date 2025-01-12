import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://0317-110-227-203-50.ngrok-free.app/api/",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "69420", // Custom header
    "Content-Type": "application/json", // Default Content-Type
    Accept: "application/json", // Accept header
  },
});

// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Add token or custom headers if needed
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     return Promise.reject(error);
//   }
// );

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  (error) => {
    // Handle errors (e.g., logging, showing error messages)
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Response Error:", error.response);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Request Error:", error.request);
    } else {
      // Something else caused the error
      console.error("General Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
