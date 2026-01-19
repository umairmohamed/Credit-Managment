import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginScreen: React.FC = () => {
  const { login, register } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Error: Please enter username and password');
      return;
    }

    if (isRegistering) {
      const success = register(username, password);
      if (success) {
        alert('Success: Registered successfully. Please login.');
        setIsRegistering(false);
      } else {
        alert('Error: Username already exists');
      }
    } else {
      const success = login(username, password);
      if (!success) {
        alert('Error: Invalid credentials');
      }
    }
  };

  return (
    <div className="login-container">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
          {isRegistering ? 'Sign up to get started' : 'Enter your credentials to access your account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-input-group">
          <svg className="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="login-input-group">
          <svg className="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>

        <button type="submit" className="login-btn">
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-btn">
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default LoginScreen;
