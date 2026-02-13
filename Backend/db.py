import mysql.connector
from mysql.connector import pooling
import os
import time
import docker
from dotenv import load_dotenv

load_dotenv()

def ensure_containers():
    """Ensure essential containers like MySQL are running"""
    try:
        client = docker.from_env()
        # Look for the database container defined in docker-compose
        db_container = client.containers.get("chakra_db")
        if db_container.status != "running":
            print("🚀 Auto-starting chakra_db container...")
            db_container.start()
            time.sleep(5) # Wait for MySQL to initialize
    except Exception as e:
        # Fallback if docker isn't running or container not found
        print(f"ℹ️ Container check: {e}")

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "user"),
    "password": os.getenv("DB_PASSWORD", "userpassword"),
    "database": os.getenv("DB_NAME", "chakraDB"),
    "pool_name": "chakra_pool",
    "pool_size": 10
}

connection_pool = None

def init_pool():
    global connection_pool
    ensure_containers()
    for i in range(10):
        try:
            connection_pool = pooling.MySQLConnectionPool(**db_config)
            print("✅ Database connection pool created successfully")
            return
        except Exception as err:
            print(f"⚠️ Database connection attempt {i+1} failed. Retrying...")
            time.sleep(3)
    raise Exception("Could not initialize database connection pool")

def get_db_connection():
    global connection_pool
    if connection_pool is None:
        init_pool()
    return connection_pool.get_connection()
