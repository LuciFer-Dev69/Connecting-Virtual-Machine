import paramiko
import threading
import time
from flask_socketio import emit

class SSHSession:
    def __init__(self, socketio, host, username, password, sid, port=22):
        self.socketio = socketio
        self.host = host
        self.username = username
        self.password = password
        self.port = port
        self.sid = sid
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.shell = None
        self.active = False
        self.lock = threading.Lock()

    def connect(self):
        try:
            self.client.connect(
                self.host,
                port=self.port,
                username=self.username, 
                password=self.password,
                timeout=10,
                look_for_keys=False,
                allow_agent=False
            )
            # Invoke an interactive shell
            self.shell = self.client.invoke_shell(term='xterm')
            self.shell.setblocking(0) # Non-blocking mode
            self.active = True
            
            # Start listener thread
            t = threading.Thread(target=self.listen_output)
            t.daemon = True
            t.start()
            return True
        except Exception as e:
            print(f"SSH Connect Error: {e}")
            return str(e)

    def listen_output(self):
        while self.active:
            try:
                if self.shell and self.shell.recv_ready():
                    # Read larger chunks for smoother output
                    data = self.shell.recv(4096).decode('utf-8', errors='ignore')
                    if data:
                        self.socketio.emit('ssh_output', data, room=self.sid)
                else:
                    time.sleep(0.01) # Low latency sleep
            except Exception as e:
                if self.active: # Only report if we didn't intentionally close
                    print(f"SSH Listener Error: {e}")
                    self.socketio.emit('ssh_error', "Connection lost", room=self.sid)
                self.close()
                break
    
    def write(self, data):
        if self.active and self.shell:
            try:
                with self.lock:
                    self.shell.send(data)
            except Exception as e:
                self.active = False
                print(f"SSH Write Error: {e}")

    def close(self):
        self.active = False
        if self.client:
            try:
                self.client.close()
            except:
                pass

sessions = {}

def create_session(socketio, sid, host, username, password, port=22):
    session = SSHSession(socketio, host, username, password, sid, port)
    result = session.connect()
    if result is True:
        sessions[sid] = session
        return True
    return result

def get_session(sid):
    return sessions.get(sid)

def close_session(sid):
    if sid in sessions:
        sessions[sid].close()
        del sessions[sid]
