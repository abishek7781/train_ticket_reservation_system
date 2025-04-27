import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Booking from './components/Booking';
import AdminPanel from './components/AdminPanel';
import AdminUsers from './components/AdminUsers';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute>
            <AdminUsers />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
