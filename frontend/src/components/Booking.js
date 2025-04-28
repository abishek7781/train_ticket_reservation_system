import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const [username, setUsername] = useState('');
  const [cities, setCities] = useState([]);
  const [trains, setTrains] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [seats, setSeats] = useState([]);
  const [suggestedSeats, setSuggestedSeats] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState(null);

  const receiptRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    axios.get('/api/cities').then(res => {
      if (res.data.success) {
        setCities(res.data.cities);
      }
    });
  }, []);

  useEffect(() => {
    if (sourceCity) {
      axios.get(`/api/trains/${sourceCity}`).then(res => {
        if (res.data.success) {
          const uniqueTrains = Array.from(new Map(res.data.trains.map(item => [item.id, item])).values());
          setTrains(uniqueTrains);
        }
      });
    } else {
      setTrains([]);
    }
    setSelectedTrain('');
    setTimeSlots([]);
    setSelectedTimeSlot('');
    setSeats([]);
    setSelectedSeats([]);
  }, [sourceCity]);

  useEffect(() => {
    if (selectedTrain) {
      axios.get(`/api/time_slots/${selectedTrain}`).then(res => {
        if (res.data.success) {
          const uniqueTimeSlots = Array.from(new Map(res.data.time_slots.map(item => [item.id, item])).values());
          setTimeSlots(uniqueTimeSlots);
        }
      });
    } else {
      setTimeSlots([]);
    }
    setSelectedTimeSlot('');
    setSeats([]);
    setSelectedSeats([]);
  }, [selectedTrain]);

  useEffect(() => {
    if (selectedTrain && selectedTimeSlot && bookingDate) {
      axios.get(`/api/seats/${selectedTrain}/${selectedTimeSlot}`, { params: { date: bookingDate } }).then(res => {
        if (res.data.success) {
          setSeats(res.data.seats);
        }
      });
      axios.get(`/api/ai_suggest_seats/${selectedTrain}/${selectedTimeSlot}`, { params: { date: bookingDate } }).then(res => {
        if (res.data.success) {
          setSuggestedSeats(res.data.suggested_seats);
        }
      });
    } else {
      setSeats([]);
      setSuggestedSeats([]);
    }
    setSelectedSeats([]);
  }, [selectedTrain, selectedTimeSlot, bookingDate]);

  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (!sourceCity || !destinationCity || !selectedTrain || !selectedTimeSlot || selectedSeats.length === 0) {
      alert('Please complete all fields to book.');
      return;
    }
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!userId || !username) {
      alert('User not logged in. Please login.');
      return;
    }

    selectedSeats.forEach(seatId => {
      axios.post('/api/book', {
        user_id: userId,
        username,
        train_id: selectedTrain,
        time_slot_id: selectedTimeSlot,
        seat_id: seatId,
        source_city: sourceCity,
        destination_city: destinationCity,
        booking_date: bookingDate
      }).then(res => {
        if (res.data.success) {
          fetchUserBookings();
          axios.get(`/api/seats/${selectedTrain}/${selectedTimeSlot}`, { params: { date: bookingDate } }).then(res => {
            if (res.data.success) setSeats(res.data.seats);
          });
          alert('Booking successful');
        } else {
          alert(res.data.message || 'Booking failed');
        }
      }).catch(() => {
        alert('Network error. Booking failed.');
      });
    });
  };

  const fetchUserBookings = () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setBookings([]);
      return;
    }
    axios.get('/api/bookings', { params: { username, role: 'user' } }).then(res => {
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    });
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const openReceipt = (booking) => {
    setReceiptBooking(booking);
    setShowReceipt(true);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptBooking(null);
  };

  const printReceipt = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open('', '', 'width=400,height=600');
    printWindow.document.write('<html><head><title>Booking Receipt</title>');
    printWindow.document.write('<style>body{font-family: Arial, sans-serif; padding: 20px;} h2 {text-align: center;} p {font-size: 14px; margin: 5px 0;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptRef.current.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Calculate min and max dates for booking date input
  const todayDate = new Date();
  const minDate = todayDate.toISOString().split('T')[0];
  const maxDateObj = new Date(todayDate);
  maxDateObj.setDate(maxDateObj.getDate() + 10);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h2 style={styles.greeting}>👋 Hello, <span style={styles.username}>{username}</span></h2>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </header>

        <h1 style={styles.title}>🚂 Train Ticket Booking</h1>

        <section style={styles.form}>
          <Input
            label="Booking Date"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            minDate={minDate}
            maxDate={maxDate}
          />
          {(() => {
            const filteredDestCities = cities.filter(city => city.id !== Number(sourceCity));
            return (
              <>
                <Select label="Source City" value={sourceCity} onChange={e => setSourceCity(e.target.value)} options={cities} />
                <Select label="Destination City" value={destinationCity} onChange={e => setDestinationCity(e.target.value)} options={filteredDestCities} />
              </>
            );
          })()}
          <Select label="Train" value={selectedTrain} onChange={e => setSelectedTrain(e.target.value)} options={trains} nameKey="name" />
          <Select label="Time Slot" value={selectedTimeSlot} onChange={e => setSelectedTimeSlot(e.target.value)} options={timeSlots} nameKey="slot_time" />
        </section>

        <h3 style={styles.sectionTitle}>🎟️ Select Your Seats</h3>
        <div style={styles.seatsGrid}>
          {seats.map(seat => (
            <div
              key={seat.id}
              onClick={() => seat.is_available && toggleSeatSelection(seat.id)}
              style={{
                ...styles.seat,
                backgroundColor: selectedSeats.includes(seat.id)
                  ? '#2ecc71'
                  : suggestedSeats.includes(seat.id)
                  ? '#3498db'
                  : seat.is_available
                  ? '#bdc3c7'
                  : '#e74c3c',
                cursor: seat.is_available ? 'pointer' : 'not-allowed',
              }}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>

        <button onClick={handleBooking} style={styles.bookBtn}>Confirm Booking</button>

        <h3 style={styles.sectionTitle}>📋 Your Bookings</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Booking ID', 'Train', 'Time Slot', 'Date', 'Seat', 'From', 'To', 'Receipt'].map((head, idx) => (
                  <th key={idx} style={styles.th}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={booking.id} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={styles.td}>{booking.id}</td>
                  <td style={styles.td}>{booking.train_name}</td>
                  <td style={styles.td}>{booking.time_slot}</td>
                  <td style={styles.td}>{new Date(booking.booking_date).toLocaleDateString('en-GB')}</td>
                  <td style={styles.td}>{booking.seat_name}</td>
                  <td style={styles.td}>{booking.source_city_name}</td>
                  <td style={styles.td}>{booking.destination_city_name}</td>
                  <td style={styles.td}>
                    <button onClick={() => openReceipt(booking)} style={styles.receiptBtn}>Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showReceipt && receiptBooking && (
          <div style={styles.receiptOverlay} onClick={closeReceipt}>
            <div style={styles.receiptContent} ref={receiptRef} onClick={e => e.stopPropagation()}>
              <h2>🎟️ Booking Receipt</h2>
              <p><strong>Booking ID:</strong> {receiptBooking.id}</p>
              <p><strong>Train:</strong> {receiptBooking.train_name}</p>
              <p><strong>Time Slot:</strong> {receiptBooking.time_slot}</p>
              <p><strong>Date:</strong> {new Date(receiptBooking.booking_date).toLocaleDateString('en-GB')}</p>
              <p><strong>Seat:</strong> {receiptBooking.seat_name}</p>
              <p><strong>From:</strong> {receiptBooking.source_city_name}</p>
              <p><strong>To:</strong> {receiptBooking.destination_city_name}</p>
              <button onClick={printReceipt} style={styles.printBtn}>Print Receipt</button>
              <button onClick={closeReceipt} style={styles.closeBtn}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = 'text', minDate, maxDate }) => {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <input type={type} value={value} onChange={onChange} min={minDate} max={maxDate} style={styles.input} />
    </div>
  );
};

const Select = ({ label, value, onChange, options, nameKey = 'name' }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>{label}</label>
    <select value={value} onChange={onChange} style={styles.input}>
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt[nameKey]}</option>
      ))}
    </select>
  </div>
);

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  greeting: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  username: {
    color: '#2563eb',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#dc2626',
    },
  },
  title: {
    textAlign: 'center',
    fontSize: '1.875rem',
    marginBottom: '2rem',
    color: '#1e293b',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    },
  },
  sectionTitle: {
    margin: '2rem 0 1.5rem',
    fontSize: '1.25rem',
    color: '#1e293b',
    fontWeight: '600',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e2e8f0',
  },
  seatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  seat: {
    width: '100%',
    aspectRatio: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0.375rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontSize: '0.875rem',
  },
  bookBtn: {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  tableContainer: {
    marginTop: '1.5rem',
    overflowX: 'auto',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px',
  },
  th: {
    padding: '1rem',
    backgroundColor: '#f8fafc',
    fontWeight: '600',
    color: '#475569',
    textAlign: 'left',
    fontSize: '0.875rem',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: '0.875rem',
  },
  receiptBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  receiptOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)',
  },
  receiptContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    '& h2': {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#1e293b',
    },
    '& p': {
      marginBottom: '0.75rem',
      color: '#475569',
      '& strong': {
        fontWeight: '600',
        color: '#1e293b',
        display: 'inline-block',
        width: '100px',
      },
    },
  },
  printBtn: {
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  closeBtn: {
    marginTop: '0.75rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#475569',
    },
  },
};

export default Booking;


