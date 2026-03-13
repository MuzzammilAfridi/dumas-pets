import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const MOCK_CUSTOMERS: Array<User & { password: string }> = [
  { id: 'c1', name: 'Sarah Mitchell', email: 'sarah@example.com', password: 'password', role: 'customer', phone: '555-0101' },
  { id: 'c2', name: 'John Davis', email: 'john@example.com', password: 'password', role: 'customer', phone: '555-0102' },
  { id: 'c3', name: 'Emily Roberts', email: 'emily@example.com', password: 'password', role: 'customer', phone: '555-0103' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('dumas_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string, role: UserRole): boolean => {
    if (role === 'admin') {
      if (email === 'admin' && password === 'admin') {
        const adminUser: User = { id: 'admin', name: 'Administrator', email: 'admin@dumas.com', role: 'admin' };
        setUser(adminUser);
        localStorage.setItem('dumas_user', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }
    const customer = MOCK_CUSTOMERS.find(c => c.email === email && c.password === password);
    if (customer) {
      const { password: _, ...userData } = customer;
      setUser(userData);
      localStorage.setItem('dumas_user', JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dumas_user');
  }, []);

  const register = useCallback((name: string, email: string, _password: string): boolean => {
    const newUser: User = { id: `c${Date.now()}`, name, email, role: 'customer' };
    setUser(newUser);
    localStorage.setItem('dumas_user', JSON.stringify(newUser));
    return true;
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('dumas_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
