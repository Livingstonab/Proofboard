import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('proofboard_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('proofboard_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('proofboard_users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (!existingUser) {
        throw new Error('User not found');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(existingUser);
      localStorage.setItem('proofboard_user', JSON.stringify(existingUser));
      Cookies.set('proofboard_session', 'active', { expires: 30 });
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, username: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('proofboard_users') || '[]');
      const emailExists = existingUsers.find((u: User) => u.email === email);
      const usernameExists = existingUsers.find((u: User) => u.username === username);
      
      if (emailExists) {
        throw new Error('Email already exists');
      }
      
      if (usernameExists) {
        throw new Error('Username already taken');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`,
        isPremium: false,
        createdAt: new Date().toISOString(),
      };
      
      // Save user to users list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('proofboard_users', JSON.stringify(updatedUsers));
      
      setUser(newUser);
      localStorage.setItem('proofboard_user', JSON.stringify(newUser));
      Cookies.set('proofboard_session', 'active', { expires: 30 });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('proofboard_user', JSON.stringify(updatedUser));
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('proofboard_users') || '[]');
      const updatedUsers = existingUsers.map((u: User) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('proofboard_users', JSON.stringify(updatedUsers));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('proofboard_user');
    Cookies.remove('proofboard_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};