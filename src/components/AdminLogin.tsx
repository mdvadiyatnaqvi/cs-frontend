import React, { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, error: authError, loading } = useAuth()!;
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email.toLowerCase().trim(), password);
      navigate('/dashboard');
    } catch {
      // Error handled by context
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center p-3" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%)'}}>
        <div className="text-white fs-1 text-glow">Loading...</div>
      </div>
    );
  }

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center p-3" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%)'}}>
      <div className="col-12 col-md-8 col-lg-5 col-xl-4">
        <div className="glass-card p-5">
          <div className="text-center mb-5 float-animation">
            <h1 className="display-3 fw-bold text-glow mb-3" style={{background: 'linear-gradient(to right, white, #e0e7ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Admin Panel
            </h1>
            <p className="lead text-light opacity-90">Welcome back! Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-semibold text-light mb-3">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control form-liquid form-lg lh-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold text-light mb-3">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-liquid form-lg lh-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {(localError || authError) && (
              <div className="alert alert-danger border-0 glass-card mb-4 animate__animated animate__shakeX">
                {localError || authError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-lg liquid-btn w-100 mb-3 float-animation shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

