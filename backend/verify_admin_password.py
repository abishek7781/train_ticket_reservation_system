import pymysql
from werkzeug.security import check_password_hash

# MySQL configurations
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'abishek21',
    'database': 'train_reservation',
    'port': 3306,
    'cursorclass': pymysql.cursors.DictCursor
}

def verify_admin_password(email, password):
    connection = pymysql.connect(**config)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT password FROM users WHERE email=%s", (email,))
            user = cursor.fetchone()
            if not user:
                print(f"No user found with email: {email}")
                return False
            stored_hash = user['password']
            if check_password_hash(stored_hash, password):
                print("Password is correct.")
                return True
            else:
                print("Password is incorrect.")
                return False
    finally:
        connection.close()

if __name__ == '__main__':
    # Change these values to test
    test_email = 'admin@aar.com'
    test_password = 'admin123'
    verify_admin_password(test_email, test_password)
