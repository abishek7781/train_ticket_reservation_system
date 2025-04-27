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
        <h1 style={styles.heading}>Smart Train Ticket Reservation System</h1>
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

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: "url('https://t4.ftcdn.net/jpg/10/51/04/05/360_F_1051040558_EbAfCj1KSiZbe9Jp9petzJALUE5HcFdG.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    padding: '20px',
  },
  loginContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 'bold',
    fontSize: '26px',
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
  },
  subHeading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#555',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    fontFamily: 'Roboto, sans-serif',
  },
  button: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
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
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Login;
