'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('कला_Niwas_user');
    if (stored) {
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
      localStorage.setItem('कला_Niwas_user', JSON.stringify(newData));
      return newData;
    });
  };

  const logout = () => {
    localStorage.removeItem('कला_Niwas_user');
    setUser(null);
    router.push('/');
  };

  return (
      <UserContext.Provider value={{ user, updateUser, logout }}>
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