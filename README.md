# Smart Train Ticket Reservation System

This project is a full-stack Smart Train Ticket Reservation System with a React frontend, Flask backend, and MySQL database. It supports user registration, login, AI-based seat suggestions, ticket booking, and an admin panel for managing bookings.

---

## Prerequisites

- Node.js and npm installed (for frontend)
- Python 3.x installed (for backend)
- MySQL server installed and running
- Git installed

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/abishek7781/train_ticket_reservation_system.git
cd train_ticket_reservation_system
```

### 2. Backend Setup

- Navigate to the backend directory:

```bash
cd backend
```

- Create a Python virtual environment (optional but recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

- Install backend dependencies:

```bash
pip install -r requirements.txt
```

- Setup MySQL database:

  - Create a database named `train_reservation`.
  - Update MySQL credentials in `backend/app.py` if needed (default username: `root`, password: `abishek21`).
  - Run the SQL schema script to create tables:

```bash
mysql -u root -p train_reservation < backend/db_schema.sql
```

- Seed initial data (cities, trains, time slots, etc.) if you have seed scripts:

```bash
python backend/seed_time_slots.py
```

- Create an admin user (optional):

```bash
python backend/create_admin_user.py
```

- Run the backend server:

```bash
python backend/app.py
```

The backend server will start on `http://localhost:5001`.

---

### 3. Frontend Setup

- Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

- Install frontend dependencies:

```bash
npm install
```

- Start the frontend development server:

```bash
npm start
```

The frontend will start on `http://localhost:3000` and proxy API requests to the backend.

---

## Usage

- Register a new user or login with existing credentials.
- Book train tickets by selecting city, train, time slot, and seats.
- Booked seats will be disabled to prevent double booking.
- Admin users can login to the admin panel to view all bookings and customer info.
- Use the logout button on booking and admin pages to logout and return to login page.

---

## Git Usage

To push changes to the GitHub repository:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

---

## Troubleshooting

- Ensure MySQL server is running and accessible.
- Verify backend API URL and credentials in frontend proxy and backend config.
- Check for port conflicts on 3000 (frontend) and 5001 (backend).
- Review console logs for errors.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions or issues, please contact the project maintainer.
