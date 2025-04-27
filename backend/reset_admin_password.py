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

def reset_admin_password(email, new_password):
    connection = pymysql.connect(**config)
    try:
        with connection.cursor() as cursor:
            hashed_password = generate_password_hash(new_password)
            sql = "UPDATE users SET password=%s WHERE email=%s"
            cursor.execute(sql, (hashed_password, email))
            connection.commit()
            print(f"Password for {email} has been reset.")
    finally:
        connection.close()

if __name__ == '__main__':
    # Change these values as needed
    admin_email = 'admin@example.com'
    new_password = 'admin1234'
    reset_admin_password(admin_email, new_password)
