import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection pool
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "chakraDB"),
    "pool_name": "mypool",
    "pool_size": 5
}

try:
    connection_pool = pooling.MySQLConnectionPool(**db_config)
    print("✅ Database connection pool created successfully")
except mysql.connector.Error as err:
    print(f"❌ Database connection failed: {err}")
    connection_pool = None

def get_db_connection():
    """Get a connection from the pool"""
    if connection_pool:
        return connection_pool.get_connection()
    else:
        raise Exception("Database connection pool is not initialized")
