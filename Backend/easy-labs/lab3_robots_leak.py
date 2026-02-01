from flask import Flask, Response, render_template_string

app = Flask(__name__)

STYLE = """
<style>
    body { background: #f0f2f5; color: #1c1e21; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; }
    .nav { background: #fff; padding: 15px 50px; border-bottom: 2px solid #e4e6eb; display: flex; justify-content: space-between; align-items: center; }
    .hero { text-align: center; padding: 100px 20px; background: linear-gradient(135deg, #1877f2 0%, #00d4ff 100%); color: white; }
    .section { max-width: 1000px; margin: 40px auto; padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left; }
    h1 { font-size: 48px; margin-bottom: 10px; }
    .logo { font-weight: bold; font-size: 24px; color: #1877f2; }
</style>
"""

HTML = f"""
<html>
    <head>{STYLE}</head>
    <body>
        <div class="nav">
            <div class="logo">PhanCorp Global</div>
            <div>Solutions | Resources | <b>Login</b></div>
        </div>
        <div class="hero">
            <h1>Securing the Future</h1>
            <p>Enterprise-grade infrastructure for modern organizations.</p>
        </div>
        <div class="section">
            <div class="card"><h3>Cloud Security</h3><p>Automated protection for hybrid deployments.</p></div>
            <div class="card"><h3>Identity Auth</h3><p>Zero-trust authentication protocols.</p></div>
            <div class="card"><h3>Managed SOC</h3><p>24/7 threat monitoring and response.</p></div>
        </div>
    </body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML)

@app.route('/robots.txt')
def robots():
    content = "User-agent: *\nDisallow: /internal-employee-directory\nDisallow: /admin-panel-secret-v3\nDisallow: /dev-backups\n"
    return Response(content, mimetype='text/plain')

@app.route('/admin-panel-secret-v3')
def admin():
    return '<div style="background:#000;color:#0f0;padding:20px;font-family:monospace;height:100vh;">' \
           '# ACCESS GRANTED<br># WELCOME PHANCORP ADMIN<br><br>' \
           'CRITICAL_FLAG: <span style="color:#fff">FLAG{ROBOTS_TXT_LEAK_CONFIRMED}</span></div>'

@app.route('/dev-backups')
@app.route('/internal-employee-directory')
def forbidden():
    return "<h1>403 Forbidden</h1><p>Access restricted to PhanCorp internal VPN.</p>", 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5103)
