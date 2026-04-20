import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ChatLoginForm from './components/ChatLoginForm';
import ChatRoom from './components/ChatRoom';
import './styles/AdminStyles.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()!;
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()!;

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const ChatProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedUser = localStorage.getItem('chatUser');
  try {
    if (!storedUser) {
      return <Navigate to="/" replace />;
    }
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser.name || !parsedUser.email || !parsedUser.clientId) {
      localStorage.removeItem('chatUser');
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem('chatUser');
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatLoginForm />} />
        <Route 
          path="/chat" 
          element={
            <ChatProtectedRoute>
              <ChatRoom />
            </ChatProtectedRoute>
          } 
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

