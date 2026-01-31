from flask import Flask, Response

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Internal Recon Target</h1><p>Operation: Service Enumeration</p><p>Objective: Find all active services on this host.</p>"

if __name__ == '__main__':
    # We also want some "dummy" services started alongside this
    import socket
    import threading

    def dummy_service(port, banner):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind(('0.0.0.0', port))
            s.listen(5)
            while True:
                conn, addr = s.accept()
                with conn:
                    conn.sendall(banner.encode())

    # Start dummy services on non-standard ports
    # Port 5110: Pseudo-SSH
    threading.Thread(target=dummy_service, args=(5110, "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\n"), daemon=True).start()
    # Port 5120: Pseudo-Redis (contains flag)
    threading.Thread(target=dummy_service, args=(5120, "+OK Flag: FLAG{SYSTEM_EN_101_DISCOVERED}\n"), daemon=True).start()

    app.run(host='0.0.0.0', port=5101)
