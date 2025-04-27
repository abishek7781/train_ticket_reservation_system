#!/bin/bash

# Kill any process using port 5001
fuser -k 5001/tcp || true

# Kill any process using port 3000
fuser -k 3000/tcp || true

# Start backend server
echo "Starting backend server on port 5001..."
cd backend
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5001 &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend React development server on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
