
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    // Create an Axios instance with the base URL and credentials
  const authAxios = axios.create({
    baseURL: "http://localhost:8000",
    // withCredentials: true, 
  });

  // Request interceptor
  authAxios.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  authAxios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      const isRefreshEndpoint = originalRequest.url === '/user/token/refresh/';
  
      // Prevent infinite loop for refresh token endpoint
      if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
        originalRequest._retry = true;
        
        try {
          const newAccessToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authAxios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
  
      // Handle refresh token endpoint errors specifically
      if (isRefreshEndpoint && error.response?.status === 401) {
        logout();
      }
  
      return Promise.reject(error);
    }
  );

  const login = async (credentials) => {
      
    try {
      const response = await authAxios.post('/user/token/', credentials);
      setAccessToken(response.data.access);
    //   await fetchUserData();
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAxios.post('/user/token/refresh/');
      setAccessToken(response.data.access);
      return response.data.access;
    } catch (error) {
      console.log( error);
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    // Optional: Call backend logout endpoint if available
  };

//   const fetchUserData = async () => {
//     try {
//       const response = await authAxios.get('/user/profile/');
//       setUser(response.data);
//     } catch (error) {
//       throw error;
//     }
//   };

  // Initialize auth state on app load
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         await refreshToken();
//         await fetchUserData();
//       } catch (error) {
//         // No valid refresh token - user needs to login
//         setAccessToken(null);
//         setUser(null);
//         console.error('Error initializing auth:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);
useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken();
        // await fetchUserData();
      } catch (error) {
        // Handle specific error if needed
      } finally {
        setLoading(false);
      }
    };
  
    // Only attempt initialization if we have a potential session
    const hasPotentialSession = document.cookie.includes('refresh_token'); // Update cookie name if different
    if (hasPotentialSession) {
      initializeAuth();
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <AuthContext.Provider value={{ authAxios, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);