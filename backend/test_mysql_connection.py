import pymysql

def test_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='abishek21',
            database='train_reservation',
            port=3306
        )
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print("Database connection successful:", result)
        connection.close()
    except Exception as e:
        print("Database connection failed:", e)

if __name__ == "__main__":
    test_connection()
