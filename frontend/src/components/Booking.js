import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const Booking = () => {
  const [cities, setCities] = useState([]);
  const [trains, setTrains] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate();  // Hook to navigate

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
          // Remove duplicate trains by id
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
          // Remove duplicate time slots by id
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
    if (selectedTrain && selectedTimeSlot) {
      axios.get(`/api/seats/${selectedTrain}/${selectedTimeSlot}`).then(res => {
        if (res.data.success) {
          setSeats(res.data.seats);
        }
      });
    } else {
      setSeats([]);
    }
    setSelectedSeats([]);
  }, [selectedTrain, selectedTimeSlot]);

  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    if (!sourceCity || !destinationCity) {
      alert('Please select source and destination cities');
      return;
    }
    if (!selectedTrain || !selectedTimeSlot || selectedSeats.length === 0) {
      alert('Please select train, time slot, and seats');
      return;
    }
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!userId || !username) {
      alert('User not logged in. Please login to book seats.');
      return;
    }

    selectedSeats.forEach(seatId => {
      axios.post('/api/book', {
        user_id: userId,
        username: username,
        train_id: selectedTrain,
        time_slot_id: selectedTimeSlot,
        seat_id: seatId,
        source_city: sourceCity,
        destination_city: destinationCity
      }).then(res => {
        console.log('Booking response:', res);
        if (res.data.success) {
          alert('Booking successful');
          axios.get(`/api/seats/${selectedTrain}/${selectedTimeSlot}`).then(res => {
            if (res.data.success) {
              setSeats(res.data.seats);
            }
          });
          fetchUserBookings();
        } else {
          alert(res.data.message || 'Booking failed');
        }
      }).catch(error => {
        console.error('Booking error:', error);
        alert('Booking failed due to network error');
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
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/');  // Redirect to the main page
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.bookingContainer}>
        <button 
          onClick={handleLogout} 
          style={styles.logoutButton}>
          Logout
        </button>
        <h2 style={styles.heading}>Book Your Train Ticket</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Source City:</label>
          <select value={sourceCity} onChange={e => setSourceCity(e.target.value)} style={styles.select}>
            <option value="">Select Source City</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Destination City:</label>
          <select value={destinationCity} onChange={e => setDestinationCity(e.target.value)} style={styles.select}>
            <option value="">Select Destination City</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Train:</label>
          <select value={selectedTrain} onChange={e => setSelectedTrain(e.target.value)} style={styles.select}>
            <option value="">Select Train</option>
            {trains.map(train => (
              <option key={train.id} value={train.id}>{train.name}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Time Slot:</label>
          <select value={selectedTimeSlot} onChange={e => setSelectedTimeSlot(e.target.value)} style={styles.select}>
            <option value="">Select Time Slot</option>
            {timeSlots.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.slot_time}</option>
            ))}
          </select>
        </div>
        <div>
          <h3 style={styles.subHeading}>Seats</h3>
          <div style={styles.seatsContainer}>
            {seats.map(seat => (
              <div
                key={seat.id}
                onClick={() => seat.is_available && toggleSeatSelection(seat.id)}
                style={{
                  ...styles.seat,
                  backgroundColor: selectedSeats.includes(seat.id)
                    ? 'green'
                    : seat.is_available
                    ? 'lightgray'
                    : 'red',
                  color: seat.is_available ? 'black' : 'white',
                  cursor: seat.is_available ? 'pointer' : 'not-allowed',
                  opacity: seat.is_available ? 1 : 0.5,
                }}
              >
                {seat.seat_number}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleBooking} style={styles.button}>Book Selected Seats</button>

        <h3 style={styles.subHeading}>Your Bookings</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Booking ID</th>
                <th style={styles.th}>Train</th>
                <th style={styles.th}>Time Slot</th>
                <th style={styles.th}>Seat</th>
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
                  <td style={styles.td}>{booking.train_name}</td>
                  <td style={styles.td}>{booking.time_slot}</td>
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
  bookingContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '800px',
    position: 'relative',
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
  subHeading: {
    marginTop: '30px',
    marginBottom: '10px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  seatsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  seat: {
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
};

export default Booking;
