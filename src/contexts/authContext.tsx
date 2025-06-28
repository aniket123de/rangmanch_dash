import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  userLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const login = () => {
    setUserLoggedIn(true);
    localStorage.setItem('userLoggedIn', 'true');
  };

  const logout = () => {
    setUserLoggedIn(false);
    localStorage.removeItem('userLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ userLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
