import React, { createContext } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');
  return <AuthContext.Provider value={[user, setUser]}>{children}</AuthContext.Provider>;
};
