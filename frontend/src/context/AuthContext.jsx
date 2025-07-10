import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessTokenRef = { current: null }; // lifted ref out for global axios access

// Automatically add access token to headers
authAxios.interceptors.request.use((config) => {
  const token = accessTokenRef.current;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const initializedRef = useRef(false);
  const isMounted = useRef(true);
  const isLoggingIn = useRef(false); // Track if a login attempt is in progress

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Sync token to ref
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const refreshToken = async () => {
    try {
      const response = await authAxios.post('/user/token/refresh/');
      const { access } = response.data;

      if (!access) return null;

      setAccessToken(access);
      accessTokenRef.current = access;

      const decoded = jwtDecode(access);
      const userId = decoded.user_id;

      const userResponse = await authAxios.get(`/user/${userId}/`);
      if (isMounted.current) {
        setUser(userResponse.data);
      }

      return access;
    } catch (err) {
      console.error("Refresh token invalid:", err);
      setAccessToken(null);
      accessTokenRef.current = null;
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        const token = await refreshToken();
        if (token) {
          // Token refreshed successfully, state is already updated in refreshToken
        }
      } catch (error) {
        console.error("Error during initial authentication:", error);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshToken]); // Depend on refreshToken to avoid potential stale closure

  // Axios 401 handler
  useEffect(() => {
    const interceptor = authAxios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;
        // Only attempt retry if it's a 401 and we haven't retried and are not currently logging in
        if (err.response?.status === 401 && !originalRequest._retry && !isLoggingIn.current) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return authAxios(originalRequest);
            } else {
              // Token refresh failed, log out the user
              if (location.pathname !== '/login') {
                await logout();
              }
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            // If refresh fails, also log out
            if (location.pathname !== '/login') {
              await logout();
            }
          }
        }
        return Promise.reject(err);
      }
    );
    return () => authAxios.interceptors.response.eject(interceptor);
  }, [navigate, location, refreshToken]); // Add dependencies

  const login = async (credentials) => {
    isLoggingIn.current = true; // Set flag when login starts
    try {
      setLoading(true);
      const res = await authAxios.post('/user/token/', credentials);
      const { access } = res.data;

      setAccessToken(access);
      accessTokenRef.current = access;

      const decoded = jwtDecode(access);
      const userId = decoded.user_id;

      const userRes = await authAxios.get(`/user/${userId}/`);
      if (isMounted.current) {
        setUser(userRes.data);
        setError(null);
      }
      navigate(location.state?.from || '/'); // Redirect to previous page or home
    } catch (err) {
      console.error("Login failed:", err);
      setAccessToken(null);
      accessTokenRef.current = null;
      setUser(null);
      setError("Invalid username or password");
      throw err;
    } finally {
      setLoading(false);
      isLoggingIn.current = false; // Reset flag when login finishes (success or failure)
    }
  };

  const logout = async () => {
    try {
      await authAxios.post('/user/logout/');
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setAccessToken(null);
      accessTokenRef.current = null;
      setUser(null);
      setError(null);
      navigate('/login');
    }
  };

  console.log(user);
  
  const apply = async (data) => {
    try {
      const response = await authAxios.post('/vendors/create/', data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || err.message || 'Something went wrong';
      console.error("Apply failed:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addNewService = async (data) => {
    try {
      setLoading(true);
      const response = await authAxios.post('/vendors/services/create/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || err.message || 'Something went wrong';
      console.error("Add service failed:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    accessToken,
    loading,
    error,
    login,
    logout,
    authAxios,
    refreshToken,
    apply,
    addNewService,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};