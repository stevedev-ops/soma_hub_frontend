import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('somahome_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default to null so new users land on Login & Self-Registration screen
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('somahome_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('somahome_user');
    }
  }, [currentUser]);

    const loginWithStudentPin = async (studentId, pin) => {
    const studentUser = await api.studentPinLogin(studentId, pin);
    setCurrentUser(studentUser);
    setIsLoginModalOpen(false);
    return studentUser;
  };

  const loginWithCredentials = async (username, password) => {
    const user = await api.login({ username, password });
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    return user;
  };

  const switchAccount = async (demoRole) => {
    const user = await api.login({ demoRole });
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    return user;
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('somahome_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('somahome_user');
    setIsLoginModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      user: currentUser,
      loginWithCredentials,
      loginWithStudentPin,
      switchAccount,
      updateProfile,
      logout,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isProfileModalOpen,
      setIsProfileModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
