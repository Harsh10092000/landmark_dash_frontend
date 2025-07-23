
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND + '/api/session/getSessionData', {
        withCredentials: true,
      })
      .then((res) => {
        console.log('AuthContext - Session data:', res.data); 
        setCurrentUser(res.data);
        
      })
      .catch((err) => {
        console.error('AuthContext - Fetch error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setCurrentUser(null);
        
      });
  }, []);

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  );
};
