import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('paymentId');

  const handlePayAndBook = () => {
    if (!paymentId) {
      alert('Invalid payment ID');
      return;
    }
    axios.post(`/api/simulate_payment/${paymentId}`)
      .then(res => {
        if (res.data.success) {
          alert('Payment successful! You can now return to the booking page.');
          navigate('/');
        } else {
          alert('Payment failed. Please try again.');
        }
      })
      .catch(() => {
        alert('Network error during payment. Please try again.');
      });
  };

  return (
    <div style={styles.container}>
      <h1>Payment Authentication</h1>
      <p>Please confirm your payment for Payment ID:</p>
      <p style={styles.paymentId}>{paymentId}</p>
      <button onClick={handlePayAndBook} style={styles.payButton}>Pay and Book</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '5rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '1rem',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
  },
  paymentId: {
    fontWeight: '700',
    fontSize: '1.25rem',
    margin: '1rem 0',
    color: '#2563eb',
  },
  payButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default PaymentPage;
