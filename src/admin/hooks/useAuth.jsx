import { useState, useCallback, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

// API base URL - in development it will be localhost, in production it will be relative
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8788' // Default Pages Functions development port
  : '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Verify token and set user
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ username: payload.sub });
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          const minutes = Math.ceil(data.remainingTime / 60);
          throw new Error(`Too many attempts. Please try again in ${minutes} minutes.`);
        }
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('authToken', data.token);
      setUser({ username: data.user.username });
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    getAuthHeaders,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;