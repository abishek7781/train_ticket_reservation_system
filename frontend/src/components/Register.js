import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { name, email, password });
      if (response.data.success) {
        alert('Registration successful. Please login.');
        navigate('/');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.registerContainer}>
        <h2 style={styles.heading}>👋🏻 Register Here !</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <label style={styles.label}>Name:</label>
          <input 
            type="text"
            placeholder='Username'
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={styles.input}
          />
          <label style={styles.label}>Email:</label>
          <input 
            type="email" 
            placeholder='user@example.com'
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
          <label style={styles.label}>Password:</label>
          <input 
            type="password" 
            placeholder='Password'
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.footerText}>
          Already have an account? <a href="/" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
}

// Internal CSS styles
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
  registerContainer: {
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
    marginBottom: '2rem',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    '&::before': {
      content: '"👋🏻"',
      fontSize: '1.2em',
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '0.25rem',
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
};

export default Register;
