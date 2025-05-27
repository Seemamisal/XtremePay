// pages/auth/Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'next/router';
import Link from 'next/link';


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Account created!');
    } catch (error) {
      setMessage('Signup error: ' + error.message);
    }
  };

  const containerStyle = {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const welcomeStyle = {
    flex: 1,
    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
    color: 'white',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };

  const formSectionStyle = {
    flex: 1,
    padding: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '300px',
  };

  const inputStyle = {
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '12px',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const messageStyle = {
    marginTop: '10px',
    color: message.includes('created') ? 'green' : 'red',
  };

  const loginLinkStyle = {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '0.9em',
  };

  return (
    <div style={containerStyle}>
      <div style={welcomeStyle}>
        <h1>HELLO<br />FRIEND!</h1>
        <p>Enter your details and start your journey with us</p>
      </div>
      <div style={formSectionStyle}>
        <form onSubmit={handleSignup} style={formStyle}>
          <h2 style={{ color: '#6a11cb' }}>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Create Account</button>
          <p style={messageStyle}>{message}</p>
          <p style={loginLinkStyle}>
              Already have an account? <Link href="/auth/Login">Log in</Link>

          </p>
        </form>
      </div>
    </div>
  );
}
