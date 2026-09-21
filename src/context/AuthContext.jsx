import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('somahome_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 1,
      username: 'steve_parent',
      name: 'Steve Kariuki (Mama Liam)',
      role: 'parent',
      phone_number: '+254712345678',
      estate: 'Kilimani, Nairobi',
      bio: 'Homeschooling dad supporting Liam in Grade 4 CBC and Maya in Year 5 Cambridge.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      children: [
        { id: 1, name: 'Liam Kariuki', grade: 'Grade 4', curriculum: 'CBC' },
        { id: 2, name: 'Maya Kariuki', grade: 'Year 5', curriculum: 'CAMBRIDGE' }
      ]
    };
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
    setIsLoginModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
    user: currentUser,
    loginWithCredentials,
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