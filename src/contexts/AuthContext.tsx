import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { loginAdmin, getMe } from '../services/api';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'LOGOUT' }
  | { type: 'ERROR'; payload: string }
  | { type: 'CHECK_AUTH_SUCCESS'; payload: AdminUser }
  | { type: 'CHECK_AUTH_FAIL' };

const AuthContext = createContext<{
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'CHECK_AUTH_SUCCESS':
      return { 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    case 'LOGOUT':
    case 'CHECK_AUTH_FAIL':
      localStorage.removeItem('adminToken');
      return { user: null, loading: false, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    try {
      const { admin } = await loginAdmin({ email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: admin });
    } catch (error: any) {
      dispatch({ type: 'ERROR', payload: error.response?.data?.error || 'Login failed' });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Check auth on mount - no flash
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      dispatch({ type: 'CHECK_AUTH_FAIL' });
      return;
    }

    const checkAuth = async () => {
      try {
        dispatch({ type: 'LOADING' });
        const data = await getMe();
        dispatch({ type: 'CHECK_AUTH_SUCCESS', payload: data.admin });
      } catch {
        dispatch({ type: 'CHECK_AUTH_FAIL' });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

