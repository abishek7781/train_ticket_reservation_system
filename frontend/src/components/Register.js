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
        <h2 style={styles.heading}>Register</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <label style={styles.label}>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={styles.input}
          />
          <label style={styles.label}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
          <label style={styles.label}>Password:</label>
          <input 
            type="password" 
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
    backgroundImage: "url('https://t4.ftcdn.net/jpg/10/51/04/05/360_F_1051040558_EbAfCj1KSiZbe9Jp9petzJALUE5HcFdG.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    padding: '20px',
  },
  registerContainer: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '400px',
    transition: 'transform 0.3s ease',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333333',
    fontSize: '28px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontSize: '14px',
    color: '#666666',
    marginBottom: '5px',
    fontWeight: '500',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.3s ease',
  },
  footerText: {
    marginTop: '20px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#777777',
  },
  link: {
    color: '#43cea2',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '5px',
  }
};

export default Register;
