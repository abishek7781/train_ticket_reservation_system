import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        if (res.data.success) {
          const formattedUsers = res.data.users.map(user => {
            const dateObj = new Date(user.created_at);
            // Format to DD-MM-YYYY HH:mm:ss
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            
            return { 
              ...user, 
              formatted_created_at: `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
            };
          });
          setUsers(formattedUsers);
        }
      });
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.panelContainer}>
        <h2 style={styles.heading}>👩🏻‍💻 Admin Panel - User Details 🧑🏻‍💼</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}><b>{user.id}</b></td>
                  <td style={styles.td}><b>{user.name}</b></td>
                  <td style={styles.td}><b>{user.email}</b></td>
                  <td style={styles.td}><b>{user.role}</b></td>
                  <td style={styles.td}><b>{user.formatted_created_at}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Keep the styles object exactly as it was
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
      content: '" "',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '1200px',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    '@supports not (backdrop-filter: blur(8px))': {
      backgroundColor: 'rgba(255, 255, 255, 0.98)'
    }
  },
  heading: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
  },
  th: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    textAlign: 'left'
  },
  td: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.875rem',
    color: '#475569'
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f8fafc'
    }
  }
};

export default AdminUsers;