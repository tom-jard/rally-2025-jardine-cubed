import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/api/entities';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not logged in", error);
      // Fallback for logged out view
      setUser({ 
        id: 'demo-user-1',
        full_name: 'Sean Hise', 
        darumas: 8880, 
        streak: 7,
        email: 'sean@playd.app'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserDarumas = async (amount) => {
    if (!user) return;
    
    const newDarumaTotal = (user.darumas || 0) + amount;
    
    try {
      // Update in backend
      await User.updateMyUserData({ darumas: newDarumaTotal });
      
      // Update local state immediately
      setUser(prevUser => ({
        ...prevUser,
        darumas: newDarumaTotal
      }));
      
      return newDarumaTotal;
    } catch (error) {
      console.error("Error updating darumas:", error);
      
      // Still update locally for demo
      setUser(prevUser => ({
        ...prevUser,
        darumas: newDarumaTotal
      }));
      
      return newDarumaTotal;
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    updateUserDarumas,
    updateUser,
    refreshUser: fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
