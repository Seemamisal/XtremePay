import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Reset link sent to your email');
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  };

  const inputStyle = {
    padding: '12px',
    margin: '10px 0',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '12px',
    width: '320px',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const messageStyle = {
    marginTop: '15px',
    color: message.startsWith('✅') ? 'green' : 'red',
    fontWeight: 'bold',
  };

  const linkStyle = {
    marginTop: '20px',
    color: '#6a11cb',
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2>Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleReset} style={buttonStyle}>
        Send Reset Link
      </button>
      <p style={messageStyle}>{message}</p>
      <Link href="/auth/Login" style={linkStyle}>← Back to Login</Link>
    </div>
  );
}
