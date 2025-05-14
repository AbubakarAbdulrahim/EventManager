import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);

  const navigate = useNavigate();

  const accessTokenRef = useRef(null);
  const initializedRef = useRef(false);

  // Sync token to ref
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
  const initAuth = async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    try {
      const token = await refreshToken();
      if (token) {
        setAccessToken(token);
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
        if (err.response?.status === 401 && !original._retry && accessTokenRef.current) {
          original._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return authAxios(original);
          } else {
            await logout();
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
    const decoded = jwtDecode(access);
    const userId = decoded.user_id;

    const userRes = await authAxios.get(`/user/${userId}/`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    setUser(userRes.data);
    setError(null);
  } catch (err) {
    console.error("Login failed:", err);
    setAccessToken(null);
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
    } catch {}
    setAccessToken(null);
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

    if (!access) return null;

    setAccessToken(access);

    // Try decoding and fetching user
    try {
      const decoded = jwtDecode(access);
      const userId = decoded.user_id;

      const userResponse = await authAxios.get(`/user/${userId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      setUser(userResponse.data);
    } catch (err) {
      console.error("User fetch failed after refresh:", err);
      // Prevent loop if user doesn't exist
      return null;
    }

    return access;
  } catch (err) {
    console.error("Refresh token invalid:", err);
    return null;
  }
};


  


  const apply = async (data) => {
    try {
      // setLoading(true);
      const response = await authAxios.post('/vendors/create/', data);
      
      setError(null);
      console.log(response)
      return response.data;
    } catch (err) {
      console.log(err)
      const errorMessage = err;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }
  const addNewService = async (data) => {
    try {
      setLoading(true);
      const response = await authAxios.post('/vendors/services/create/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setError(null);
      console.log(response)
      return response.data;
    } catch (err) {
      console.log(err)
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }


  const fetchServices = async () => {
    try { 
      const response = await authAxios.get('/vendors/services/');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  
  const fetchVendors = async () => {
    try {
      const response = await authAxios.get('/vendors/');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, error, login, logout, authAxios, refreshToken, apply, fetchServices, fetchVendors, addNewService }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
