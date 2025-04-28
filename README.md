# Train Ticket Booking Application

## Overview

This application allows users to book train tickets with AI-assisted seat suggestions. The AI provides multiple seat suggestion strategies to help users select the best available seats.

## Features

- User registration and login
- Browse cities, trains, and time slots
- View available seats for selected train and time slot
- AI seat suggestions with multiple strategies:
  - Default: Contiguous seats near the middle with fewer adjacent booked seats
  - Window/Aisle Preference: Suggests window or aisle seats
  - Group Seating: Suggests grouped seats for larger groups
  - Balanced Distribution: Suggests seats spread evenly across the train
- Booking confirmation and receipt printing
- User booking history
- Admin panel for managing users and bookings (if applicable)

## Setup Instructions

1. Backend:
   - Requires Python 3.x
   - Install dependencies: `pip install -r backend/requirements.txt`
   - Configure MySQL database with the schema in `backend/db_schema.sql`
   - Update database credentials in `backend/app.py` if needed
   - Run backend server: `python backend/app.py`

2. Frontend:
   - Requires Node.js and npm
   - Navigate to `frontend` directory
   - Install dependencies: `npm install`
   - Run frontend server: `npm start`

## Usage

- Register a new user or login with existing credentials
- Select booking date, source and destination cities
- Choose train and time slot
- Select AI seat suggestion strategy from the dropdown
- View AI suggested seats highlighted in blue
- Select seats and confirm booking
- View and print booking receipts

## GitHub Repository

The project is version controlled and pushed to GitHub repository named "v".

## Notes

- Ensure backend server is running on port 5001
- Frontend proxies API requests to backend
- AI seat suggestion strategies can be extended or customized in backend/app.py

## License

MIT License
