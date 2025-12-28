import requests
import time
import json

BASE_URL = "http://127.0.0.1:5000/api/pwnbox"

def test_pwnbox():
    print("Testing PwnBox API...")
    
    # 1. Spawn
    print("1. Spawning PwnBox (might take time to build)...")
    try:
        res = requests.post(f"{BASE_URL}/spawn", json={"user_id": 999}, timeout=300)
        if res.status_code == 200:
            data = res.json()
            print(f"✅ Spawn Success: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Spawn Failed: {res.status_code} - {res.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # 2. Stop
    print("\n2. Stopping PwnBox...")
    try:
        res = requests.post(f"{BASE_URL}/stop", json={"user_id": 999})
        if res.status_code == 200:
            print("✅ Stop Success")
        else:
            print(f"❌ Stop Failed: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_pwnbox()
