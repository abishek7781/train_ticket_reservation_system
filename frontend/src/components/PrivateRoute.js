import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    // Not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
