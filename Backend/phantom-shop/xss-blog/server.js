const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const HTML_LOGIN = `
<!DOCTYPE html>
<html>
<head>
    <title>Phantom Login</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; color: #00ff00; height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
        .login-box { background: #111; border: 2px solid #00ff00; border-radius: 12px; padding: 40px; width: 350px; box-shadow: 0 0 20px rgba(0, 255, 0, 0.2); }
        h1 { color: #ff0066; text-align: center; margin-bottom: 30px; text-shadow: 0 0 10px #ff0066; font-size: 24px; }
        .input-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: #888; }
        input { width: 100%; padding: 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; color: #00ff00; outline: none; box-sizing: border-box; }
        input:focus { border-color: #00ff00; }
        button { width: 100%; padding: 12px; background: #00ff00; color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 16px; transition: 0.3s; }
        button:hover { background: #00cc00; transform: translateY(-2px); }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #444; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>⚡ PHANTOM LOGIN</h1>
        <form action="/login" method="POST">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Admin/Guest" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit">AUTHENTICATE</button>
        </form>
        <div class="footer">Secure Access Portal v2.0.4</div>
    </div>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(HTML_LOGIN);
});

app.post('/login', (req, res) => {
    const { username } = req.body;

    // VULNERABLE: Reflecting username without sanitization
    const HTML_WELCOME = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Access Granted</title>
        <style>
            body { font-family: monospace; background: #0a0a0a; color: #00ff00; padding: 50px; text-align: center; }
            .msg { font-size: 24px; border: 1px solid #00ff00; padding: 40px; border-radius: 12px; background: #111; display: inline-block; }
            .flag { margin-top: 30px; color: #ff0066; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="msg">
            Welcome back, ${username}!
            <br><br>
            <div class="flag">System Status: SECURE</div>
        </div>
        <p><a href="/" style="color: #444;">Logout</a></p>
    </body>
    </html>
    `;

    res.send(HTML_WELCOME);
});

app.listen(5050, () => {
    console.log('Phantom Login (XSS) running on port 5050');
});
