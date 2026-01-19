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
      <h2>{isRegistering ? 'Register' : 'Admin Login'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-btn">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-btn">
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default LoginScreen;
