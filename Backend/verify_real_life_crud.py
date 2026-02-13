import requests
import json

BASE_URL = "http://localhost:5001/api/real-life-challenges"

def test_crud():
    print(f"Testing CRUD at {BASE_URL}...")
    
    # 1. GET initial list
    try:
        r = requests.get(BASE_URL)
        print(f"GET status: {r.status_code}")
        initial_list = r.json()
        print(f"Initial count: {len(initial_list)}")
    except Exception as e:
        print(f"GET failed: {e}")
        return

    # 2. POST new challenge
    new_challenge = {
        "title": "Test CRUD Challenge",
        "description": "This is a test challenge added via API.",
        "difficulty": "Easy",
        "category": "Test",
        "points": 5,
        "flag": "FLAG{crud_test_success}",
        "docker_image": "test-image",
        "port": 8080,
        "hints": json.dumps(["Hint 1", "Hint 2"])
    }
    
    try:
        r = requests.post(BASE_URL, json=new_challenge)
        print(f"POST status: {r.status_code}")
        print(f"POST Response: {r.text}")
        if r.status_code == 201:
            new_id = r.json().get('id')
            print(f"Created ID: {new_id}")
            
            # 3. GET to verify
            r = requests.get(BASE_URL)
            current_list = r.json()
            print(f"Count after add: {len(current_list)}")
            found = any(c['id'] == new_id for c in current_list)
            print(f"Found new challenge? {found}")
            
            # 4. DELETE
            if new_id:
                r = requests.delete(f"{BASE_URL}/{new_id}")
                print(f"DELETE status: {r.status_code}")
                
                # 5. GET to verify delete
                r = requests.get(BASE_URL)
                final_list = r.json()
                print(f"Count after delete: {len(final_list)}")
                found_after = any(c['id'] == new_id for c in final_list)
                print(f"Found after delete? {found_after}")
        else:
            print("Failed to create challenge.")
            
    except Exception as e:
        print(f"CRUD operations failed: {e}")

if __name__ == "__main__":
    test_crud()
