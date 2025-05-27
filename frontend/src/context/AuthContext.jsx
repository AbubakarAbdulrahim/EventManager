import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Automatically add access token to headers
authAxios.interceptors.request.use((config) => {
  const token = accessTokenRef.current;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let accessTokenRef = { current: null }; // lifted ref out for global axios access

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const initializedRef = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Sync token to ref
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    const initAuth = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        console.log('im init');
        
        const token = await refreshToken();
        if (token) {
          setAccessToken(token);
          accessTokenRef.current = token;
        } else {
          setAccessToken(null);
          setUser(null);
        }
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Axios 401 handler
  useEffect(() => {
    const interceptor = authAxios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          console.log('im inteceptor');
          
          const newToken = await refreshToken();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return authAxios(original);
          } else {
            await logout();
            // window.location.href = '/login';
          }
        }
        return Promise.reject(err);
      }
    );
    return () => authAxios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (credentials) => {
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
    } catch (err) {
      console.error("Login failed:", err);
      setAccessToken(null);
      accessTokenRef.current = null;
      setUser(null);
      setError("Invalid username or password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAxios.post('/user/logout/');
    } catch (err) {
      console.warn("Logout failed:", err);
    }
    setAccessToken(null);
    accessTokenRef.current = null;
    setUser(null);
    setError(null);
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAxios.post('/user/token/refresh/');
      const { access } = response.data;
      console.log(response.data);
      

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
      return null;
    }
  };

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

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
