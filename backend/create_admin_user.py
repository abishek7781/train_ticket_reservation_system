import pymysql
from werkzeug.security import generate_password_hash

# MySQL configurations
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'abishek21',
    'database': 'train_reservation',
    'port': 3306,
    'cursorclass': pymysql.cursors.DictCursor
}

def create_admin_user():
    connection = pymysql.connect(**config)
    try:
        with connection.cursor() as cursor:
            name = 'Admin'
            email = 'admin@aar.com'
            password = 'aarthi123'  # Change this password as needed
            hashed_password = generate_password_hash(password)
            role = 'admin'
            sql = "INSERT INTO users (name, email, password, role, created_at) VALUES (%s, %s, %s, %s, NOW())"
            cursor.execute(sql, (name, email, hashed_password, role))
            connection.commit()
            print(f"Admin user created with email: {email} and password: {password}")
    finally:
        connection.close()

if __name__ == '__main__':
    create_admin_user()
