
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'victim' | 'lawyer' | 'psychologist';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // In a real app, this would check for a stored token or session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock authentication functions for demo
  const login = async (email: string, password: string) => {
    // This would actually call an API in a real application
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo users for testing different roles
      const demoUsers = [
        { id: '1', name: 'John Victim', email: 'victim@example.com', password: 'password', role: 'victim' as UserRole },
        { id: '2', name: 'Jane Lawyer', email: 'lawyer@example.com', password: 'password', role: 'lawyer' as UserRole },
        { id: '3', name: 'Dr. Smith', email: 'psychologist@example.com', password: 'password', role: 'psychologist' as UserRole }
      ];

      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // This would actually call an API in a real application
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user (in a real app this would be saved to a database)
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
