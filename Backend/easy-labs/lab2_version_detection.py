from flask import Flask, Response, render_template_string

app = Flask(__name__)

STYLE = """
<style>
    body { background: #0f172a; color: #cbd5e1; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { background: #1e293b; border: 1px solid #334155; padding: 40px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center; max-width: 500px; }
    h1 { color: #f8fafc; margin-bottom: 20px; }
    .version { font-size: 14px; color: #64748b; background: #0f172a; padding: 5px 10px; border-radius: 4px; border: 1px solid #334155; }
    .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
</style>
"""

HTML = f"""
<html>
    <head>{STYLE}</head>
    <body>
        <div class="container">
            <h1>Chakra Legacy CMS</h1>
            <p>This is a legacy management portal for internal assets.</p>
            <div class="version">System Version: v0.4.2 (LTS)</div>
            <a href="#" class="btn">ADMIN LOGIN</a>
        </div>
    </body>
</html>
"""

@app.route('/')
def index():
    resp = Response(render_template_string(HTML))
    resp.headers['Server'] = 'ChakraVulnerableServer/0.4.2'
    resp.headers['X-Powered-By'] = 'PHP/5.3.3'
    return resp

@app.route('/flag')
@app.route('/v0.4.2/flag')
def flag():
    return "FLAG{VERSION_42_DETECTED_0x41}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5102)
