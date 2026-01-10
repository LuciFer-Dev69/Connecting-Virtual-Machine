import os
from flask import Flask, request, render_template_string, send_from_directory, redirect, url_for

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'png', 'gif'}

# Ensure upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Phantom Profile - Edit</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background: #111; padding: 40px; border-radius: 12px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 400px; text-align: center; }
        h2 { color: #00d4ff; margin-bottom: 30px; }
        .upload-box { border: 2px dashed #444; padding: 30px; border-radius: 8px; margin-bottom: 20px; transition: 0.3s; }
        .upload-box:hover { border-color: #00d4ff; }
        input[type="file"] { margin-bottom: 20px; color: #888; }
        button { background: #00d4ff; color: #000; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; font-size: 16px; }
        button:hover { background: #00b8e6; }
        .msg { margin-top: 20px; padding: 10px; border-radius: 4px; font-size: 14px; }
        .success { background: #1b4332; color: #75f0b3; border: 1px solid #2d6a4f; }
        .error { background: #441010; color: #ff6b6b; border: 1px solid #661010; }
        .preview { margin-top: 20px; }
        .preview img { max-width: 100%; border-radius: 8px; border: 1px solid #333; }
        .hint { margin-top: 20px; font-size: 12px; color: #555; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Edit Profile</h2>
        <div class="upload-box">
            <form method="post" enctype="multipart/form-data">
                <input type="file" name="file" accept=".jpg,.png,.gif">
                <button type="submit">Update Avatar</button>
            </form>
        </div>
        
        {% if message %}
            <div class="msg {{ 'success' if 'success' in message.lower() else 'error' }}">
                {{ message }}
            </div>
            {% if filepath %}
                <div class="preview">
                    <p>File uploaded to: <a href="{{ filepath }}" style="color: #00d4ff;">{{ filepath }}</a></p>
                </div>
            {% endif %}
        {% endif %}

        <div class="hint">
            Tip: Only .jpg, .png, and .gif files are allowed for your profile security.
        </div>
    </div>
</body>
</html>
"""

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    message = None
    filepath = None
    if request.method == 'POST':
        if 'file' not in request.files:
            message = "No file part"
        else:
            file = request.files['file']
            if file.filename == '':
                message = "No selected file"
            elif file and allowed_file(file.filename):
                filename = file.filename
                # INTENTIONAL VULNERABILITY: No sanitization of content, only extension check.
                # Also saving with original filename allowing potential path traversal or RCE if served incorrectly.
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                message = "Profile updated successfully!"
                filepath = f"/uploads/{filename}"
            else:
                message = "Security Error: Invalid file extension!"

    return render_template_string(HTML_TEMPLATE, message=message, filepath=filepath)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    # INTENTIONAL VULNERABILITY: If this was a PHP/Node environment, we'd execute it.
    # In Flask, we can simulate "execution" for the purpose of the lab by checking for a payload.
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if os.path.exists(path):
        with open(path, 'r', errors='ignore') as f:
            content = f.read()
            # Simple "execution" trigger for the lab
            if "<script>" in content or "<?php" in content or "import os" in content:
                return f"SYSTEM_EXPLOITED: Flag discovered! <br><br> 🚩 <b>FLAG{{file_upload_misconfig}}</b> <br><br> Raw Output: <pre>{content}</pre>"
    
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6060)
