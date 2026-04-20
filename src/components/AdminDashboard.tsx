import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout, loading } = useAuth()!;
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center p-3" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%)'}}>
        <div className="text-white fs-1 text-glow">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%)', minHeight: '100vh'}} className="p-3 p-md-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5 float-animation">
            <h1 className="display-2 fw-bold text-glow mb-4" style={{background: 'linear-gradient(to right, white, #e0e7ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>
              Welcome, <span className="text-info">{user.email.split('@')[0]}</span>
            </h1>
            <p className="lead text-light opacity-90 fs-3">Dashboard Overview</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card p-4 p-lg-5 mb-4 float-animation">
              <h2 className="h3 fw-bold text-light mb-4">
                <i className="bi bi-person-circle text-success me-3 fs-3"></i>
                Profile Information
              </h2>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-light">Admin ID</label>
                  <div className="form-control form-liquid form-lg bg-dark text-monospace small lh-lg">
                    {user.id}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-light">Role</label>
                  <div className="badge bg-success fs-5 px-4 py-3 glass-card">
                    {user.role?.toUpperCase()}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-light">Email</label>
                  <div className="form-control form-liquid form-lg">
                    <i className="bi bi-envelope text-info me-2"></i>
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4 float-animation">
              <h3 className="h4 fw-bold text-light mb-4 text-center">
                Quick Actions
              </h3>
              <div className="d-grid gap-3">
                <button className="btn liquid-btn">
                  <i className="bi bi-people me-2"></i>
                  Manage Users
                </button>
                <button className="btn liquid-btn">
                  <i className="bi bi-bar-chart me-2"></i>
                  View Analytics
                </button>
                <button className="btn liquid-btn">
                  <i className="bi bi-pencil-square me-2"></i>
                  Content Manager
                </button>
                <button className="btn liquid-btn">
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-auto">
            <button onClick={logout} className="btn btn-danger btn-lg liquid-btn px-5 py-3 shadow-lg float-animation">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

