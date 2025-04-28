import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get('/api/bookings', { params: { role: 'admin' } });
        if (res.data.success) {
          const bookingsWithFormattedDate = res.data.bookings.map(b => ({
            ...b,
            booking_date: b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-GB') : ''
          }));
          setBookings(bookingsWithFormattedDate);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/');
  };

  const goToAdminUsers = () => {
    navigate('/admin/users');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.panelContainer}>
        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
        <h2 style={styles.heading}>🧑🏻‍💻 Admin Panel - All Bookings 🎫</h2>
        <button onClick={goToAdminUsers} style={styles.adminUsersButton}>
          View Admin Users
        </button>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Booking ID</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Seat Name</th>
                <th style={styles.th}>Train Name</th>
                <th style={styles.th}>Time Slot</th>
                <th style={styles.th}>Booking Date</th>
                <th style={styles.th}>Source City</th>
                <th style={styles.th}>Destination City</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr
                  key={booking.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td style={styles.td}>{booking.id}</td>
                  <td style={styles.td}>{booking.username}</td>
                  <td style={styles.td}>{booking.seat_name}</td>
                  <td style={styles.td}>{booking.train_name}</td>
                  <td style={styles.td}>{booking.time_slot}</td>
                  <td style={styles.td}>{booking.booking_date}</td>
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
  panelContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '2.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '1200px',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  logoutContainer: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(220, 38, 38, 0.1)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 8px rgba(220, 38, 38, 0.2)',
    },
  },
  adminUsersButton: {
    marginBottom: '1rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)',
    transition: 'all 0.3s ease',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#1e293b',
    fontSize: '1.875rem',
    fontWeight: '700',
    paddingBottom: '1rem',
    borderBottom: '2px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  th: {
    backgroundColor: '#3b82f6',
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    color: 'white',
    textAlign: 'left',
    padding: '1rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    position: 'sticky',
    top: 0,
  },
  td: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.875rem',
    color: '#475569',
    transition: 'all 0.2s ease',
  },
};

export default AdminPanel;
