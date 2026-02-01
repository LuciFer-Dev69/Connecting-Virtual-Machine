from flask import Flask, render_template_string
import socket
import threading

app = Flask(__name__)

STYLE = """
<style>
    body { background: #0a0a0c; color: #00d4ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { background: rgba(20, 20, 25, 0.8); border: 1px solid #00d4ff40; padding: 40px; border-radius: 12px; box-shadow: 0 0 30px rgba(0, 212, 255, 0.1); text-align: center; max-width: 600px; }
    h1 { margin-top: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; color: #fff; }
    p { color: #888; line-height: 1.6; }
    .status { display: inline-block; padding: 5px 15px; background: #00ff8820; border: 1px solid #00ff8840; color: #00ff88; border-radius: 20px; font-size: 12px; margin-bottom: 20px; text-transform: uppercase; }
</style>
"""

HTML = f"""
<html>
    <head>{STYLE}</head>
    <body>
        <div class="container">
            <div class="status">System Active</div>
            <h1>Internal Recon Target</h1>
            <p>Welcome to the <b>Service Enumeration</b> module. Your objective is to perform a deep scan of this host to identify all exposed services.</p>
            <p style="font-family: monospace; background: #000; padding: 10px; border-radius: 5px; color: #00d4ff70;">SCAN_SCOPE: Local Network Interface<br>THREAT_LEVEL: Elevated</p>
        </div>
    </body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML)

def dummy_service(port, banner):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind(('0.0.0.0', port))
            s.listen(5)
            while True:
                conn, addr = s.accept()
                with conn:
                    conn.sendall(banner.encode())
        except:
            pass

if __name__ == '__main__':
    # Start dummy services on non-standard ports
    # Port 5110: Pseudo-SSH
    threading.Thread(target=dummy_service, args=(5110, "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\n"), daemon=True).start()
    # Port 5120: Pseudo-Redis (contains flag)
    threading.Thread(target=dummy_service, args=(5120, "+OK Flag: FLAG{SYSTEM_EN_101_DISCOVERED}\n"), daemon=True).start()
    # Port 5130: Pseudo-FTP
    threading.Thread(target=dummy_service, args=(5130, "220 (vsFTPd 3.0.3)\n"), daemon=True).start()

    app.run(host='0.0.0.0', port=5101)
