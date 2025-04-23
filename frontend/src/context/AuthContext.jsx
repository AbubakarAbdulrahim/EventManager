import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Create axios instance with default settings
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessTokenRef = useRef(accessToken);
  const axiosInterceptorRef = useRef(null);

  // Sync accessToken with ref
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Initial auth check on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken();
      } catch (error) {
        // Initial auth check failed, user remains logged out
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Setup axios interceptors
  useEffect(() => {
    // Add request interceptor
    axiosInterceptorRef.current = authAxios.interceptors.request.use(
      (config) => {
        if (accessTokenRef.current) {
          config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If unauthorized and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshedAccessToken = await refreshToken();

          if (!refreshedAccessToken) {
            return Promise.reject(error);
          }
            originalRequest.headers.Authorization = `Bearer ${accessTokenRef.current}`;
            return authAxios(originalRequest);
          } catch (refreshError) {
            await logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      authAxios.interceptors.request.eject(axiosInterceptorRef.current);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAxios.post('/user/token/', credentials);
      const { access } = response.data;
      setAccessToken(access);
      
      const decodedToken = jwtDecode(access);
      const userId = decodedToken.user_id;
      
      // Use the new token directly in the request headers
      const userResponse = await authAxios.get(`/user/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      console.log(userResponse)
      setUser(userResponse.data);
      // setUser(user);
      setError(null);
      console.log(user)
      return response.data;
    } catch (err) {
      console.log(err.response?.data?.message)
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!accessTokenRef.current) return; // Prevent loop if already logged out
    
    try {
      await authAxios.post('/user/logout/');
      setAccessToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err.message);
      const errorMessage = err.response?.data?.message || 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const apply = async (data) => {
    try {
      setLoading(true);
      const response = await authAxios.post('/vendors/', data);
      
      setError(null);
      console.log(response)
      return response.data;
    } catch (err) {
      console.log(err)
      const errorMessage = err;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authAxios.post('/user/token/refresh/');
      const { access } = response.data;
      setAccessToken(access);


      // Decode the new token to get user ID
      const decodedToken = jwtDecode(access);
      const userId = decodedToken.user_id;

      const userResponse = await authAxios.get(`/user/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      
      setUser(userResponse.data);
      setError(null);
      return access;
      
    } catch (err) {
      setAccessToken(null);
      setUser(null);
      const errorMessage = err.response?.data?.message || 'Session expired';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    error,
    login,
    logout,
    apply,
    authAxios,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};