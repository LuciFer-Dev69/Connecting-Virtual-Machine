from flask import Flask, Response

app = Flask(__name__)

@app.route('/')
def index():
    resp = Response("<h1>Version Detection Lab</h1><p>Target: Chakra Legacy CMS v0.4.2</p>")
    resp.headers['Server'] = 'ChakraVulnerableServer/0.4.2'
    resp.headers['X-Powered-By'] = 'PHP/5.3.3' # Misleading but common
    return resp

@app.route('/flag')
def flag():
    return "FLAG{VERSION_42_DETECTED_0x41}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5102)
