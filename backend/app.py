from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymysql
from werkzeug.security import check_password_hash, generate_password_hash
import datetime
import json
import traceback
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app, supports_credentials=True)

@app.before_request
def log_request_info():
    print(f"Incoming request: {request.method} {request.path}")

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'abishek21'
app.config['MYSQL_DB'] = 'train_reservation'
app.config['MYSQL_PORT'] = 3306

def get_db_connection():
    try:
        connection = pymysql.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            database=app.config['MYSQL_DB'],
            port=app.config['MYSQL_PORT'],
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except Exception as e:
        print(f"Error creating DB connection: {e}")
        return None

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.timedelta):
            return str(obj)
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        return super().default(obj)

app.json_encoder = CustomJSONEncoder

@app.route('/api/test', methods=['GET'])
def api_test():
    return jsonify({'success': True, 'message': 'API is reachable'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'success': False, 'message': 'Missing registration information'}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({'success': False, 'message': 'Database connection error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                return jsonify({'success': False, 'message': 'Email already registered'}), 409

            hashed_password = generate_password_hash(password)
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                (name, email, hashed_password, 'user')
            )
            conn.commit()
            return jsonify({'success': True, 'message': 'Registration successful'})
    except Exception as e:
        print(f"Registration error: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(f"Login attempt for email: {email}")

    if not email or not password:
        print("Email or password missing in request")
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    conn = get_db_connection()
    if conn is None:
        print("Database connection error")
        return jsonify({'success': False, 'message': 'Database connection error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            user = cursor.fetchone()
            if user:
                print(f"User found: {user['email']}")
                print(f"Stored password hash: {user['password']}")
                print(f"Password provided: {password}")
                if check_password_hash(user['password'], password):
                    print("Password check passed")
                    return jsonify({
                        'success': True,
                        'role': user.get('role', 'user'),
                        'username': user.get('name'),
                        'user_id': user.get('id')
                    })
                else:
                    print("Password check failed")
            else:
                print("User not found")
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/cities', methods=['GET'])
def get_cities():
    conn = get_db_connection()
    if conn is None:
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name FROM cities")
            cities = cursor.fetchall()
            return jsonify({'success': True, 'cities': cities})
    except Exception as e:
        print(f"Error fetching cities: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/trains/<int:city_id>', methods=['GET'])
def get_trains(city_id):
    print(f"Fetching trains for city_id: {city_id}")
    conn = get_db_connection()
    if conn is None:
        print("Database connection error")
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT id, name FROM trains WHERE city_id=%s", (city_id,))
            trains = cursor.fetchall()
            # Remove duplicates by id in Python as well
            unique_trains = []
            seen_ids = set()
            for train in trains:
                if train['id'] not in seen_ids:
                    unique_trains.append(train)
                    seen_ids.add(train['id'])
            print(f"Unique trains found: {unique_trains}")
            return jsonify({'success': True, 'trains': unique_trains})
    except Exception as e:
        print(f"Error fetching trains: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/time_slots/<int:train_id>', methods=['GET'])
def get_time_slots(train_id):
    print(f"Fetching time slots for train_id: {train_id}")
    conn = get_db_connection()
    if conn is None:
        print("Database connection error")
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT id, slot_time FROM time_slots WHERE train_id=%s", (train_id,))
            time_slots = cursor.fetchall()
            # Remove duplicates by id in Python as well
            unique_time_slots = []
            seen_ids = set()
            for slot in time_slots:
                if slot['id'] not in seen_ids:
                    unique_time_slots.append(slot)
                    seen_ids.add(slot['id'])
            print(f"Unique time slots found: {unique_time_slots}")
            if not unique_time_slots:
                print(f"No time slots found for train_id: {train_id}")
            return jsonify({'success': True, 'time_slots': unique_time_slots})
    except Exception as e:
        print(f"Error fetching time slots: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/seats/<int:train_id>/<int:time_slot_id>', methods=['GET'])
def get_seats(train_id, time_slot_id):
    print(f"Fetching seats for train_id: {train_id}, time_slot_id: {time_slot_id}")
    conn = get_db_connection()
    if conn is None:
        print("Database connection error")
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT id, seat_number FROM seats WHERE train_id=%s", (train_id,))
            seats = cursor.fetchall()
            # Remove duplicates by id in Python as well
            unique_seats = []
            seen_ids = set()
            for seat in seats:
                if seat['id'] not in seen_ids:
                    unique_seats.append(seat)
                    seen_ids.add(seat['id'])
            cursor.execute("SELECT seat_id FROM bookings WHERE train_id=%s AND time_slot_id=%s", (train_id, time_slot_id))
            booked_seats = cursor.fetchall()
            booked_seat_ids = {seat['seat_id'] for seat in booked_seats}
            for seat in unique_seats:
                seat['is_available'] = seat['id'] not in booked_seat_ids
            return jsonify({'success': True, 'seats': unique_seats})
    except Exception as e:
        print(f"Error fetching seats: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/ai_suggest_seats/<int:train_id>/<int:time_slot_id>', methods=['GET'])
def ai_suggest_seats(train_id, time_slot_id):
    print(f"AI suggesting seats for train_id: {train_id}, time_slot_id: {time_slot_id}")
    conn = get_db_connection()
    if conn is None:
        print("Database connection error")
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
    try:
        with conn.cursor() as cursor:
            # Get all seats for the train
            cursor.execute("SELECT DISTINCT id, seat_number FROM seats WHERE train_id=%s ORDER BY seat_number", (train_id,))
            seats = cursor.fetchall()
            # Get booked seats for the train and time slot
            cursor.execute("SELECT seat_id FROM bookings WHERE train_id=%s AND time_slot_id=%s", (train_id, time_slot_id))
            booked_seats = cursor.fetchall()
            booked_seat_ids = {seat['seat_id'] for seat in booked_seats}
            # Filter available seats
            available_seats = [seat for seat in seats if seat['id'] not in booked_seat_ids]
            # Enhanced AI heuristic:
            # 1. Prefer contiguous seats (3 seats)
            # 2. Prefer seats closer to middle of seat range
            # 3. Prefer seats with fewer adjacent booked seats
            suggested_seats = []
            seat_numbers = []
            seat_map = {}
            for seat in available_seats:
                try:
                    num = int(seat['seat_number'][1:])
                    seat_numbers.append(num)
                    seat_map[num] = seat['id']
                except:
                    continue
            seat_numbers.sort()
            middle = seat_numbers[len(seat_numbers)//2] if seat_numbers else 0

            def adjacent_booked_count(num):
                count = 0
                for adj in [num-1, num+1]:
                    adj_id = seat_map.get(adj)
                    if adj_id and adj_id in booked_seat_ids:
                        count += 1
                return count

            # Try to find 3 contiguous seats with minimal adjacent booked seats sum and close to middle
            best_score = None
            best_group = None
            for i in range(len(seat_numbers)-2):
                group = seat_numbers[i:i+3]
                if group[1] == group[0]+1 and group[2] == group[1]+1:
                    adj_sum = sum(adjacent_booked_count(n) for n in group)
                    dist_to_middle = abs(group[1] - middle)
                    score = (adj_sum, dist_to_middle)
                    if best_score is None or score < best_score:
                        best_score = score
                        best_group = group
            if best_group:
                suggested_seats = [seat_map[n] for n in best_group]
            else:
                # If no contiguous group, suggest up to 3 seats closest to middle with least adjacent booked seats
                seat_scores = []
                for n in seat_numbers:
                    adj = adjacent_booked_count(n)
                    dist = abs(n - middle)
                    seat_scores.append((adj, dist, n))
                seat_scores.sort()
                suggested_seats = [seat_map[n] for _, _, n in seat_scores[:3]]

            return jsonify({'success': True, 'suggested_seats': suggested_seats})
    except Exception as e:
        print(f"Error in AI seat suggestion: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/book', methods=['POST'])
def book_seats():
    data = request.get_json()
    print(f"Booking request data: {data}")
    user_id = data.get('user_id')
    username = data.get('username')
    train_id = data.get('train_id')
    time_slot_id = data.get('time_slot_id')
    seat_id = data.get('seat_id')
    source_city = data.get('source_city')
    destination_city = data.get('destination_city')
    booking_date = data.get('booking_date')

    if not all([user_id, username, train_id, time_slot_id, seat_id, source_city, destination_city, booking_date]):
        print("Missing booking information in request")
        return jsonify({'success': False, 'message': 'Missing booking information'}), 400

    # Validate booking_date format
    try:
        datetime.datetime.strptime(booking_date, '%Y-%m-%d')
    except Exception as e:
        print(f"Invalid booking_date format: {booking_date}, error: {e}")
        return jsonify({'success': False, 'message': 'Invalid booking_date format, expected YYYY-MM-DD'}), 400

    conn = get_db_connection()
    if conn is None:
        print("Database connection error")
        return jsonify({'success': False, 'message': 'Database connection error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id FROM bookings
                WHERE train_id=%s AND time_slot_id=%s AND seat_id=%s AND booking_date=%s
            """, (train_id, time_slot_id, seat_id, booking_date))
            existing_booking = cursor.fetchone()
            if existing_booking:
                print("Seat already booked")
                return jsonify({'success': False, 'message': 'Seat already booked'}), 409

            cursor.execute("""
                INSERT INTO bookings (user_id, username, train_id, time_slot_id, seat_id, source_city, destination_city, booking_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (user_id, username, train_id, time_slot_id, seat_id, source_city, destination_city, booking_date))
            conn.commit()
            print("Booking successful")
            return jsonify({'success': True, 'message': 'Booking successful'})
    except Exception as e:
        print(f"Error processing booking: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/bookings', methods=['GET'])
def get_user_bookings():
    username = request.args.get('username')
    role = request.args.get('role')

    conn = get_db_connection()
    if conn is None:
        return jsonify({'success': False, 'message': 'Database connection error'}), 500

    try:
        with conn.cursor() as cursor:
            if role == 'admin':
                cursor.execute("""
                    SELECT b.id, u.name AS username, t.name AS train_name, ts.slot_time AS time_slot, s.seat_number AS seat_name,
                           c1.name AS source_city_name, c2.name AS destination_city_name, b.booking_date
                    FROM bookings b
                    JOIN users u ON b.user_id = u.id
                    JOIN trains t ON b.train_id = t.id
                    JOIN time_slots ts ON b.time_slot_id = ts.id
                    JOIN seats s ON b.seat_id = s.id
                    JOIN cities c1 ON b.source_city = c1.id
                    JOIN cities c2 ON b.destination_city = c2.id
                """)
                bookings = cursor.fetchall()
                return jsonify({'success': True, 'bookings': bookings})
            else:
                if not username:
                    return jsonify({'success': False, 'message': 'Username is required'}), 400
                cursor.execute("""
                    SELECT b.id, t.name AS train_name, ts.slot_time AS time_slot, s.seat_number AS seat_name,
                           c1.name AS source_city_name, c2.name AS destination_city_name, b.booking_date
                    FROM bookings b
                    JOIN trains t ON b.train_id = t.id
                    JOIN time_slots ts ON b.time_slot_id = ts.id
                    JOIN seats s ON b.seat_id = s.id
                    JOIN cities c1 ON b.source_city = c1.id
                    JOIN cities c2 ON b.destination_city = c2.id
                    WHERE b.username = %s
                """, (username,))
                bookings = cursor.fetchall()
                return jsonify({'success': True, 'bookings': bookings})
    except Exception as e:
        print(f"Error fetching bookings: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    if conn is None:
        return jsonify({'success': False, 'message': 'Database connection error'}), 500
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, name, email, role, created_at FROM users")
            users = cursor.fetchall()
            return jsonify({'success': True, 'users': users})
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    finally:
        conn.close()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
