import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const profiles = [
  { src: 'https://cdn-icons-png.flaticon.com/256/12930/12930643.png', name: 'Member 1' },
  { src: 'https://cdn-icons-png.freepik.com/256/3135/3135823.png?semt=ais_hybrid', name: 'Member 2' },
  { src: 'https://cdn-icons-png.flaticon.com/256/12930/12930643.png', name: 'Member 3' },
  { src: 'https://cdn-icons-png.freepik.com/256/3135/3135823.png?semt=ais_hybrid', name: 'Member 4' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('userId', response.data.user_id);
        localStorage.setItem('username', response.data.username);
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/booking');
        }
      } else {
        setError('Entered username and password is wrong');
      }
    } catch (err) {
      setError('Entered username and password is wrong');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginContainer}>
        <h1 style={styles.heading}>Smart Train Ticket Reservation System</h1>
        <h2 style={styles.subHeading}>👋🏻 Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
          {error && <p style={styles.errorText}>{error}</p>}
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
        <p style={styles.footerText}>
          <b>Team Members</b>
        </p>
        <div style={styles.profileIconsContainer} >
          {profiles.map((profile, index) => (
            <div key={index} style={styles.profileItem}>
              <img src={profile.src} alt={`Profile ${index + 1}`} style={styles.profileIcon} />
              <p style={styles.profileName}>{profile.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url(https://i.gifer.com/7Xqg.gif)',
      backgroundSize: 'cover',
      opacity: '0.05',
      zIndex: 0,
    }
  },
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    padding: '3rem',
    width: '100%',
    maxWidth: '450px',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#1e293b',
    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subHeading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#64748b',
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  input: {
    padding: '1rem 1.25rem',
    borderRadius: '0.75rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    background: 'white',
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
    },
  },
  button: {
    padding: '1rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    color: 'white',
    fontWeight: '600',
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(59, 130, 246, 0.3)',
    },
  },
  errorText: {
    color: '#ef4444',
    marginTop: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: '#fef2f2',
  },
  footerText: {
    marginTop: '1.5rem',
    fontSize: '0.875rem',
    textAlign: 'center',
    color: '#64748b',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#2563eb',
    },
  },
  profileIconsContainer: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  profileItem: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
    },
  },
  profileIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  profileName: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: '#475569',
    fontWeight: '500',
  },
};

export default Login;
