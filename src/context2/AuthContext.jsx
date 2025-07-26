
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check session
  const checkSession = () => {
    setIsLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND + '/api/session/getSessionData', {
        withCredentials: true,
      })
      .then((res) => {
        console.log('AuthContext - Session data:', res.data); 
        setCurrentUser(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('AuthContext - Fetch error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setCurrentUser(null);
        setIsLoading(false);
      });
  };

  // Function to handle logout
  const logout = async () => {
    try {
      // Call Next.js auth signOut endpoint
      // await fetch('https://landmarkplots.com/api/auth/cleanup-sessions', {
        await fetch('http://localhost:3000/api/auth/cleanup-sessions', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Clear local session
      setCurrentUser(null);
      
      // Redirect to login
      window.location.href = 'https://landmarkplots.com/login';
    } catch (err) {
      console.error('Logout error:', err);
      // Even if there's an error, clear local session and redirect
      setCurrentUser(null);
      window.location.href = 'https://landmarkplots.com/login';
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{currentUser, checkSession, logout, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
