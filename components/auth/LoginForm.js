import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
     setTimeout(() => {
      router.push('/dashboard');
    }, 1500); // Show message for 1.5 seconds
    } catch (error) {
      setMessage('Login error: ' + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email to reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      setMessage('Reset error: ' + error.message);
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

  const textStyle = {
    textAlign: 'right',
    fontSize: '0.9em',
    color: '#333',
    marginBottom: '10px',
    cursor: 'pointer', // 👈 makes it look clickable
    textDecoration: 'underline', // optional for clarity
  };

  const messageStyle = {
    marginTop: '10px',
    color: message.includes('successful') || message.includes('sent') ? 'green' : 'red',
  };

  const signupLinkStyle = {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '0.9em',
  };

  return (
    <div style={containerStyle}>
      <div style={welcomeStyle}>
        <h1>WELCOME To XtremePay<br /> AGAIN</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      </div>
      <div style={formSectionStyle}>
        <form onSubmit={handleLogin} style={formStyle}>
          <h2 style={{ color: '#6a11cb' }}>Log in</h2>
          <input
            type="email"
            placeholder="user name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          {/* 👇 Made the text clickable */}
          <div style={textStyle} onClick={handleForgotPassword}>
            Forgot your <b>password?</b>
          </div>
          <button type="submit" style={buttonStyle}>Log in</button>
          <p style={messageStyle}>{message}</p>
          <p style={signupLinkStyle}>
            Don’t have an account? <Link href="/auth/Signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
