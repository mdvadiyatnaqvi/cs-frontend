import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient, getClientId } from '../services/api';

interface User {
  name: string;
  email: string;
  clientId: string;
}

const ChatLoginForm: React.FC = () => {
  const [user, setUser] = useState<User>({ name: '', email: '', clientId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const handleEnterChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!user.name || !user.email || isLoading) return;

    setIsLoading(true);
    try {
      let clientId: string;
      try {
        await addClient(user.name, user.email);
        const getRes = await getClientId(user.email);
        clientId = getRes.clientId;
      } catch (addError: any) {
        if (addError.response?.data?.error === 'Email already registered') {
          setToastMsg('Email already registered. Please use a different email.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          return;
        } else {
          throw addError;
        }
      }
      const fullUser = { ...user, clientId };
      localStorage.setItem('chatUser', JSON.stringify(fullUser));
      navigate('/chat');
    } catch (error: any) {
      console.error('Client setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-dark position-relative">
      <div className="card shadow" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5 text-center">
          <h2 className="card-title text-primary mb-4">Enter Chat Room</h2>
          <form onSubmit={handleEnterChat}>
            <div className="mb-3">
              <label className="form-label fw-bold mb-2 d-block text-start">Full Name</label>
              <input
                type="text"
                className="form-control form-lg"
                placeholder="Enter your name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold mb-2 d-block text-start">Email</label>
              <input
                type="email"
                className="form-control form-lg"
                placeholder="your@email.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3" disabled={isLoading}>
              <i className="bi bi-chat-dots me-2"></i>
              {isLoading ? 'Connecting...' : 'Enter Chat Room'}
            </button>
          </form>
          <p className="mt-3 text-muted small">
            Client ID auto-generated on backend
          </p>
        </div>
      </div>
      {showToast && (
        <div className="position-absolute top-0 end-0 m-3 translate-middle-y-start" style={{ zIndex: 1060 }}>
          <div className="alert alert-warning alert-dismissible fade show shadow" role="alert">
            {toastMsg}
            <button type="button" className="btn-close" onClick={() => setShowToast(false)} aria-label="Close"></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLoginForm;

