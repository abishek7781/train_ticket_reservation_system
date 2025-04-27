import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error or server not reachable');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginContainer}>
        <h1 style={styles.heading}>Smart Train Ticket Reservation System</h1> {/* Added Heading */}
        <h2 style={styles.subHeading}>Login</h2>
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
      </div>
    </div>
  );
};

// Internal CSS styles
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    padding: '20px',
  },
  loginContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontFamily: 'Roboto, sans-serif', // Added professional font
    fontWeight: 'bold',               // Bold text
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  subHeading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
    fontSize: '14px',
    textAlign: 'center',
  },
  footerText: {
    marginTop: '15px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#666',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Login;
