import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();  // Hook to navigate

  useEffect(() => {
    axios.get('/api/bookings', { params: { role: 'admin' } }).then(res => {
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/');  // Redirect to localhost:3000
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.panelContainer}>
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}>
          Logout
        </button>
        <h2 style={styles.heading}>Admin Panel - All Bookings</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Booking ID</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Seat Name</th>
                <th style={styles.th}>Train Name</th>
                <th style={styles.th}>Time Slot</th>
                <th style={styles.th}>Source City</th>
                <th style={styles.th}>Destination City</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr
                  key={booking.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f1f1'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                  <td style={styles.td}>{booking.id}</td>
                  <td style={styles.td}>{booking.username}</td>
                  <td style={styles.td}>{booking.seat_name}</td>
                  <td style={styles.td}>{booking.train_name}</td>
                  <td style={styles.td}>{booking.time_slot}</td>
                  <td style={styles.td}>{booking.source_city_name}</td>
                  <td style={styles.td}>{booking.destination_city_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  panelContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '1000px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'left',
    padding: '12px 15px',
    fontSize: '16px',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
    fontSize: '15px',
    color: '#555',
  },
};

export default AdminPanel;
