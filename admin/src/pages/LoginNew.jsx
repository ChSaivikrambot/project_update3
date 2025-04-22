import React, { useState } from 'react';
import axios from 'axios';

function LoginNew() {
  const [isSignup, setIsSignup] = useState(false);

  const [adminId, setAdminId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin-login', {
        adminId,
        password,
      });

      if (res.data.success) {
        alert('Login successful!');
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminData', JSON.stringify(res.data.adminData));
        window.location.href = '/dashboard';
      } else {
        alert(res.data.message || 'Invalid Admin ID or Password');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin-signup', {
        adminId,
        phone,
        password,
        secretKey,  // Send the secretKey to the server for validation
      });

      if (res.data.success) {
        alert('Signup successful! You can now login.');
        setIsSignup(false);
      } else {
        alert(res.data.message || 'Signup failed!');
      }
    } catch (err) {
      console.error(err);
      alert('Error during signup. Please try again.');
    }
  };

  return (
    <div className="login-page" style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h1>{isSignup ? 'Admin Signup' : 'Admin Login'}</h1>

      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        <div>
          <label>Admin ID</label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />
        </div>

        {isSignup && (
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isSignup && (
          <div>
            <label>Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: '1rem' }}>
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        {isSignup ? (
          <>
            Already have an account?{' '}
            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsSignup(false)}>
              Login here
            </span>
          </>
        ) : (
          <>
            Didn't sign up?{' '}
            <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsSignup(true)}>
              Sign up here
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export default LoginNew;
