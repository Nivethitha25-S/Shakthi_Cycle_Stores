import React, { useState } from 'react';
import { authApi } from '../services/api';
import logoImg from '../assets/logo.png';

function Login({ onLoginSuccess, onBackToLanding }) {
  const [username, setUsername] = useState('Nivetha');
  const [password, setPassword] = useState('Nive@1234');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await authApi.login(username.trim(), password.trim());
      if (data && data.success) {
        onLoginSuccess(data);
      } else {
        setErrorMessage(data?.message || 'Invalid username or password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark py-5 px-3 position-relative" style={{ backgroundColor: '#0f172a' }}>
      {onBackToLanding && (
        <button
          type="button"
          className="btn btn-outline-light position-absolute top-0 start-0 m-4 d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm"
          onClick={onBackToLanding}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Store Website</span>
        </button>
      )}

      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="bg-primary text-white text-center py-4 px-4 position-relative" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
          <div
            className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow p-2 mb-3"
            style={{ width: '80px', height: '80px' }}
          >
            <img
              src={logoImg}
              alt="Shakthi Cycle Stores"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <h4 className="fw-bold mb-1 tracking-wide text-white">Shakthi Cycle Stores</h4>
          <p className="small text-white-50 mb-0 fw-medium">CYCLE SHOP & AUTO ACCESSORIES</p>
        </div>

        <div className="card-body p-4 p-sm-5 bg-white">
          <div className="text-center mb-4">
            <h5 className="fw-bold text-dark mb-1">Store Admin Sign In</h5>
            <small className="text-muted">Enter your administrative credentials to continue</small>
          </div>

          {errorMessage && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small" role="alert">
              <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary small fw-semibold" htmlFor="username">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  id="username"
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small fw-semibold" htmlFor="password">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right fs-5"></i>
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top text-center">
            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
              Shakthi Cycle Stores And Autos &bull; Fast & Reliable Inventory Billing
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
