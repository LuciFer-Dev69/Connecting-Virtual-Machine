import mysql.connector
import os

conn = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'chakraDB')
)
cursor = conn.cursor()
cursor.execute('SELECT id, title, category, level FROM challenges WHERE category="Linux" ORDER BY level')
results = cursor.fetchall()
print('Linux Challenges:')
for r in results:
    print(f'ID: {r[0]}, Title: {r[1]}, Category: {r[2]}, Level: {r[3]}')
cursor.close()
conn.close()
