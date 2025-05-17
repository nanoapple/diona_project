
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define UserRole type and export it
export type UserRole = 'admin' | 'lawyer' | 'psychologist' | 'claimant';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  title?: string;
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      // In a real app, we'd check with the backend
      // For demo, we'll check localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo users for testing different roles
      const demoUsers: Record<string, User> = {
        "admin@example.com": {
          id: "admin1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
          avatar: "https://i.pravatar.cc/150?u=admin"
        },
        "lawyer@example.com": {
          id: "lawyer1",
          email: "lawyer@example.com",
          name: "John Smith",
          role: "lawyer",
          avatar: "https://i.pravatar.cc/150?u=lawyer",
          company: "Smith & Associates",
          title: "Senior Partner"
        },
        "psychologist@example.com": {
          id: "psych1",
          email: "psychologist@example.com",
          name: "Dr. Emma Wilson",
          role: "psychologist",
          avatar: "https://i.pravatar.cc/150?u=psych",
          company: "Mind Wellness Clinic",
          title: "Clinical Psychologist"
        },
        "claimant@example.com": {
          id: "client1",
          email: "claimant@example.com",
          name: "Sarah Johnson",
          role: "claimant",
          avatar: "https://i.pravatar.cc/150?u=client"
        }
      };

      // Check if email exists
      if (!demoUsers[email]) {
        throw new Error("Invalid email or password");
      }

      // In a real app, we would check password here
      // For demo, any password is valid

      const user = demoUsers[email];
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
