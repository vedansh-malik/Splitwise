import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Safely retrieve Token
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 2. Safely retrieve User Data (Prevents the JSON crash)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      // If savedUser is the string "undefined", return null
      if (!savedUser || savedUser === "undefined") return null;
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // If data is corrupted, clear it so the app doesn't crash next time
      localStorage.removeItem('user');
      return null;
    }
  });

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    // Ensure we never save "undefined" as a string
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
    
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};