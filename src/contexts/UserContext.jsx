import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const defaultUserInfo = {
  id: 'SP10023',
  name: 'Văn Anh',
  email: 'vananh@example.com',
  phone: '0123456789',
  address: 'Hà Nội, Việt Nam',
  avatar: '/default-avatar.jpg',
  rating: 4.8,
  totalOrders: 156,
  completionRate: '98%',
  onTimeRate: '95%',
};

export const UserProvider = ({ children }) => {
  // Initialize state from localStorage or use default
  const [userInfo, setUserInfo] = useState(() => {
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
      try {
        return JSON.parse(savedInfo);
      } catch (error) {
        console.error('Error parsing saved user info:', error);
        return defaultUserInfo;
      }
    }
    return defaultUserInfo;
  });

  // Save to localStorage whenever userInfo changes
  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 