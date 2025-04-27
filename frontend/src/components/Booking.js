import React, { useState, useEffect } from 'react';
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h2 style={styles.greeting}>👋 Hello, <span style={styles.username}>{username}</span></h2>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </header>

        <h1 style={styles.title}>🚂 Train Ticket Booking</h1>

        <section style={styles.form}>
          <Input label="Booking Date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} minDate today maxDays={9} />
          <Select label="Source City" value={sourceCity} onChange={e => setSourceCity(e.target.value)} options={cities} />
          <Select label="Destination City" value={destinationCity} onChange={e => setDestinationCity(e.target.value)} options={cities} />
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
                {['Booking ID', 'Train', 'Time Slot', 'Date', 'Seat', 'From', 'To'].map((head, idx) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = 'text', minDate, today, maxDays }) => {
  const min = today ? new Date().toISOString().split('T')[0] : undefined;
  const max = today && maxDays ? new Date(Date.now() + maxDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined;
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <input type={type} value={value} onChange={onChange} min={minDate || min} max={max} style={styles.input} />
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
    backgroundImage: "url('https://t4.ftcdn.net/jpg/10/51/04/05/360_F_1051040558_EbAfCj1KSiZbe9Jp9petzJALUE5HcFdG.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    padding: '30px',
    width: '100%',
    maxWidth: '1000px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  greeting: {
    fontSize: '22px',
    fontWeight: 'bold',
  },
  username: {
    color: '#6a11cb',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  sectionTitle: {
    marginTop: '30px',
    marginBottom: '15px',
    fontSize: '22px',
    color: '#444',
  },
  seatsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  seat: {
    width: '48px',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    fontWeight: 'bold',
    transition: '0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  bookBtn: {
    width: '100%',
    padding: '15px',
    marginTop: '20px',
    backgroundColor: '#6a11cb',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  tableContainer: {
    marginTop: '20px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
};

export default Booking;
