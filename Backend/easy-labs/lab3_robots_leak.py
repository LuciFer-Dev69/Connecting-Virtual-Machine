from flask import Flask, Response

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Public Corporate Portal</h1><p>Our sensitive files are protected... or are they?</p>"

@app.route('/robots.txt')
def robots():
    content = "User-agent: *\nDisallow: /admin-portal-v3\nDisallow: /tmp-backups\n"
    return Response(content, mimetype='text/plain')

@app.route('/admin-portal-v3')
def admin():
    return "<h1>Admin Portal v3</h1><p>Welcome Admin. Here is the secret flag: <b>FLAG{ROBOTS_TXT_LEAK_CONFIRMED}</b></p>"

@app.route('/tmp-backups')
def backups():
    return "Empty directory."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5103)
