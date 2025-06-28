import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { signOutUser } from '../firebase/auth';
import { getUserData } from '../firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  userLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
  updateUserData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = () => {
    // This is handled by Firebase auth state listener
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserData = (data: any) => {
    setUserData(data);
  };

  const userLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      userLoggedIn, 
      loading, 
      login, 
      logout, 
      updateUserData 
    }}>
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
