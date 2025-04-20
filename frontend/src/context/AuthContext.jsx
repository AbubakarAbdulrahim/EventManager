import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authAxios = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
  });

  authAxios.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isRefreshEndpoint = originalRequest.url === '/user/token/refresh/';

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

      if (isRefreshEndpoint && error.response?.status === 401) {
        logout();
      }

      return Promise.reject(error);
    }
  );

  const login = async (credentials) => {
    try {
      const response = await axios.post('/user/token/', credentials, {
        withCredentials: true,
      });
      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);

      // Manually decode token and fetch user data with the new token
      const decodedToken = jwtDecode(newAccessToken);
      const userId = decodedToken.user_id;
      
      // Use the new token directly in the request headers
      const userResponse = await authAxios.get(`/user/${userId}/`, {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });
      setUser(userResponse.data);
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAxios.post('/user/token/refresh/');
      console.log(response)
      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!accessToken) return;

        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.user_id;
        const response = await authAxios.get(`/user/${userId}/`);
        setUser(response.data);
        console.log(response)
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [accessToken]); // Fetch user data when accessToken changes

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken();
      } catch (error) {
        // Handle failed refresh (user remains logged out)
      } finally {
        setLoading(false);
      }
    };
    // const hasPotentialSession = document.cookie.includes('refresh');
    // console.log(hasPotentialSession)
    // if (hasPotentialSession) {
      initializeAuth();
    // } else {
    //   setLoading(false);
    // }
  }, []);

  return (
    <AuthContext.Provider value={{ authAxios, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};     

export const useAuth = () => useContext(AuthContext);