import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginScreen: React.FC = () => {
  const { login, register, validateCredentials } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [tempUser, setTempUser] = useState<{username: string, password: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otpStep) {
      if (enteredOtp === generatedOtp) {
        if (tempUser) {
          login(tempUser.username, tempUser.password);
        }
      } else {
        alert('Error: Invalid OTP');
      }
      return;
    }

    if (!username || !password) {
      alert('Error: Please enter username and password');
      return;
    }

    if (isRegistering) {
      if (!mobile) {
        alert('Error: Please enter mobile number');
        return;
      }
      const success = register(username, password, mobile);
      if (success) {
        alert('Success: Registered successfully. Please login.');
        setIsRegistering(false);
        setMobile('');
        setPassword('');
        setUsername('');
      } else {
        alert('Error: Username already exists');
      }
    } else {
      const validUser = validateCredentials(username, password);
      if (validUser) {
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);
        setTempUser({ username, password });
        setOtpStep(true);
        alert(`Your OTP is: ${otp}`); // Simulate sending OTP
      } else {
        alert('Error: Invalid credentials');
      }
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isRegistering ? 'Sign up to get started' : 'Enter your credentials to access your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!otpStep && (
            <>
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

              {isRegistering && (
                <div className="login-input-group">
                  <svg className="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="login-input"
                  />
                </div>
              )}
            </>
          )}

          {otpStep && (
            <div className="login-input-group" style={{ marginTop: '20px' }}>
              <svg className="login-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="text"
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="login-input"
              />
            </div>
          )}

          <button type="submit" className="login-btn">
            {otpStep ? 'Verify OTP' : (isRegistering ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        {!otpStep && (
          <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-btn">
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
