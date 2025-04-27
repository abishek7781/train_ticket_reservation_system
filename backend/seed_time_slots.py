import pymysql

def seed_time_slots():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='abishek21',
        database='train_reservation',
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )
    try:
        with connection.cursor() as cursor:
            # Get existing time slots per train
            cursor.execute("SELECT train_id, slot_time FROM time_slots")
            existing_slots = cursor.fetchall()
            existing_set = set((row['train_id'], str(row['slot_time'])) for row in existing_slots)

            # Define desired time slots for all trains
            time_slots_data = [
                ('Chennai Express', ['08:00:00', '14:00:00', '20:00:00']),
                ('Southern Star', ['09:00:00', '15:00:00', '21:00:00']),
                ('Bay of Bengal', ['07:30:00', '13:30:00', '19:30:00']),
                ('Mumbai Local', ['06:00:00', '12:00:00', '18:00:00']),
                ('Western Flyer', ['07:00:00', '13:00:00', '19:00:00']),
                ('Coastal Cruiser', ['08:30:00', '14:30:00', '20:30:00']),
                ('Hyderabad Special', ['06:30:00', '12:30:00', '18:30:00']),
                ('Deccan Queen', ['07:30:00', '13:30:00', '19:30:00']),
                ('Nizam Express', ['08:30:00', '14:30:00', '20:30:00']),
                ('Bangalore Rajdhani', ['06:00:00', '12:00:00', '18:00:00']),
                ('Silk Route', ['07:00:00', '13:00:00', '19:00:00']),
                ('Garden City Express', ['08:00:00', '14:00:00', '20:00:00']),
                ('Delhi Duronto', ['06:30:00', '12:30:00', '18:30:00']),
                ('Capital Express', ['07:30:00', '13:30:00', '19:30:00']),
                ('Metro Flyer', ['08:30:00', '14:30:00', '20:30:00']),
                ('Punjab Mail', ['06:00:00', '12:00:00', '18:00:00']),
                ('Golden Temple Express', ['07:00:00', '13:00:00', '19:00:00']),
                ('Ludhiana Local', ['08:00:00', '14:00:00', '20:00:00']),
            ]

            for train_name, slots in time_slots_data:
                cursor.execute("SELECT id FROM trains WHERE name=%s", (train_name,))
                trains = cursor.fetchall()
                for train in trains:
                    train_id = train['id']
                    for slot_time in slots:
                        if (train_id, slot_time) not in existing_set:
                            cursor.execute(
                                "INSERT INTO time_slots (train_id, slot_time) VALUES (%s, %s)",
                                (train_id, slot_time)
                            )
            connection.commit()
            print("Time slots seeded successfully for all train instances.")
    except Exception as e:
        print(f"Error seeding time slots: {e}")
    finally:
        connection.close()

if __name__ == '__main__':
    seed_time_slots()
