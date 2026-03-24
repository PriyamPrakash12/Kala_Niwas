'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  businessType: string;
  dob: string;
};

type UserContextType = {
  user: UserProfile | null;
  updateUser: (data: Partial<UserProfile>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kala_kit_user');
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(stored));
    } else {
      setUser({
        firstName: 'Guest',
        lastName: 'User',
        email: '',
        location: 'Not specified',
        businessType: 'Not specified',
        dob: 'Not specified',
      });
    }
  }, []);

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const newData = { ...prev, ...data } as UserProfile;
      localStorage.setItem('kala_kit_user', JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
