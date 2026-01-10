from flask import Flask, request, render_template_string, jsonify, url_for

app = Flask(__name__)

# Product catalog with Local Images
PRODUCTS = {
    "1": {
        "name": "Smart Watch Ultra", 
        "price": 150, 
        "category": "Wearables", 
        "desc": "Next-gen biometric sensors. Exposed heart-rate API.",
        "image": "/static/images/s-l500.webp"
    },
    "2": {
        "name": "Sonic Pro Headphones", 
        "price": 120, 
        "category": "Audio", 
        "desc": "Lossless transmission. Vulnerable to signal interception.",
        "image": "/static/images/51xYjWS66kL._AC_SX466_.jpg"
    },
    "3": {
        "name": "Apex Gaming Mouse", 
        "price": 60, 
        "category": "Peripherals", 
        "desc": "Ultra-low latency. Scriptable macro-engine.",
        "image": "/static/images/618pjd98msL.webp"
    },
    "4": {
        "name": "Hyper-Charge 65W", 
        "price": 80, 
        "category": "Accessories", 
        "desc": "High-voltage output. Internal power delivery controller.",
        "image": "/static/images/hyperjuice-65w-usb-c-charger-4879471.webp"
    },
    "5": {
        "name": "PowerStream 20k", 
        "price": 45, 
        "category": "Accessories", 
        "desc": "Portable energy grid. Unencrypted battery management.",
        "image": "/static/images/IMG_4843.webp"
    },
    "6": {
        "name": "ZenBuds Pro", 
        "price": 220, 
        "category": "Audio", 
        "desc": "Active sound masking. Noise floor: -90dB.",
        "image": "/static/images/pTtVYu6sZb9XtTwLBysg28.webp"
    },
    "7": {
        "name": "Vision 4K Webcam", 
        "price": 110, 
        "category": "Peripherals", 
        "desc": "Wide-angle optic. Zero-day detected in firmware v1.2.",
        "image": "/static/images/s-l400.webp"
    }
}

# In-memory transaction log for demonstration purposes
TRANSACTIONS = []

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHANTOM.TECH | SECURE HARDWARE LAB</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #050506;
            --card: #0d0d10;
            --primary: #00f3ff;
            --accent: #ff0055;
            --text: #ffffff;
            --muted: #71717a;
            --border: #1e1e21;
            --success: #00ff88;
            --warning: #facc15;
        }

        * { box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: var(--bg); 
            color: var(--text); 
            margin: 0; 
            padding: 0;
            overflow-x: hidden;
        }

        .navbar {
            padding: 15px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(5, 5, 6, 0.9);
            backdrop-filter: blur(15px);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid var(--border);
        }

        .logo { 
            font-weight: 800; 
            font-size: 20px; 
            letter-spacing: -0.5px;
            color: var(--primary);
            text-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
            font-family: 'JetBrains Mono', monospace;
        }

        .nav-links {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .cart-trigger {
            background: var(--card);
            border: 1px solid var(--border);
            padding: 8px 18px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: 0.2s;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
        }

        .cart-trigger:hover {
            border-color: var(--primary);
            background: rgba(0, 243, 255, 0.05);
        }

        .cart-badge {
            background: var(--primary);
            color: #000;
            font-weight: bold;
            padding: 1px 6px;
            border-radius: 4px;
        }

        .cart-section-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0 10px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 5px;
            display: flex;
            justify-content: space-between;
        }

        .hero {
            padding: 80px 5% 50px;
            text-align: center;
            position: relative;
        }

        .hero h1 { 
            font-size: 56px; 
            font-weight: 800; 
            margin-bottom: 15px; 
            background: linear-gradient(135deg, #fff 30%, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -2px;
            text-transform: uppercase;
        }
        .hero p { 
            color: var(--primary); 
            font-size: 18px; 
            max-width: 700px; 
            margin: 0 auto; 
            font-family: 'JetBrains Mono', monospace;
            opacity: 0.8;
        }

        .container { 
            padding: 30px 4% 100px;
            max-width: 100%;
            display: grid;
            grid-template-columns: 1fr 400px; /* Persistent Right-Side Log */
            gap: 40px;
            margin: 0;
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        /* Mockup Styled Navbar Links */
        .system-logs-btn {
            background: #fff;
            color: #000;
            border: 2px solid #fff;
            padding: 6px 20px;
            border-radius: 4px;
            font-weight: 800;
            font-size: 14px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            transition: 0.2s;
            margin-right: 15px;
            display: none; /* Hidden because we are making the log persistent on the right now */
        }

        /* Side Panel: persistent integrated log */
        .logs-panel {
            background: #000;
            border: 1px solid var(--border);
            border-radius: 8px;
            height: calc(100vh - 150px);
            position: sticky;
            top: 100px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .logs-panel-header {
            background: var(--border);
            padding: 12px 20px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .logs-panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            background: #050506;
        }

        /* Side Drawers Shared Styling */
        .drawer {
            position: fixed;
            top: 0;
            right: -450px;
            width: 450px;
            height: 100vh;
            background: var(--bg);
            border-left: 1px solid var(--border);
            z-index: 1000;
            padding: 40px 30px;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            box-shadow: -20px 0 50px rgba(0,0,0,0.8);
        }

        .drawer.open { right: 0; }

        /* Toast Notifications */
        .toast {
            position: fixed;
            top: 30px;
            right: 30px;
            background: #00ff88; /* Success Green */
            color: #000;
            padding: 15px 30px;
            border-radius: 4px;
            font-weight: 800;
            z-index: 2000;
            transform: translateX(120%);
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'JetBrains Mono', monospace;
            box-shadow: 0 10px 30px rgba(0,255,136,0.3);
        }

        .toast.show { transform: translateX(0); }
        .audit-panel {
            margin-top: 50px;
            background: #000;
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
        }

        .audit-header {
            background: var(--border);
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: bold;
        }

        .audit-content {
            padding: 20px;
            max-height: 300px;
            overflow-y: auto;
            font-family: 'JetBrains Mono', monospace;
            background: #050506;
        }

        .log-entry {
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            display: grid;
            grid-template-columns: 100px 1fr 100px 150px;
            gap: 20px;
            font-size: 12px;
        }

        .log-entry:last-child { border: none; }
        .log-time { color: var(--muted); }
        .log-product { color: #fff; font-weight: 600; }
        .log-price { color: var(--primary); }
        .log-status { font-weight: 800; text-align: right; }
        .status-breach { color: var(--accent); }
        .status-valid { color: var(--success); }

        /* Cart Drawer */
        #cart-drawer {
            position: fixed;
            top: 0;
            right: -450px;
            width: 450px;
            height: 100vh;
            background: var(--bg);
            border-left: 1px solid var(--border);
            z-index: 1000;
            padding: 40px;
            transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            box-shadow: -20px 0 50px rgba(0,0,0,0.8);
        }

        #cart-drawer.open { right: 0; }

        .drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .drawer-header h2 { font-family: 'JetBrains Mono', monospace; font-size: 20px; }

        .close-drawer {
            background: var(--card);
            border: 1px solid var(--border);
            color: #fff;
            width: 35px;
            height: 35px;
            border-radius: 4px;
            cursor: pointer;
        }

        #cart-items { flex: 1; overflow-y: auto; }

        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid var(--border);
        }

        .cart-item-info h4 { margin: 0; font-size: 15px; font-weight: 600; }
        .cart-item-info p { margin: 4px 0 0; color: var(--primary); font-size: 14px; font-family: 'JetBrains Mono', monospace; }

        .checkout-footer {
            padding-top: 25px;
            border-top: 1px solid var(--border);
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            font-family: 'JetBrains Mono', monospace;
        }

        .checkout-btn {
            width: 100%;
            padding: 16px;
            background: var(--success);
            color: #000;
            border: none;
            border-radius: 8px;
            font-weight: 800;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
            font-family: 'JetBrains Mono', monospace;
        }

        .checkout-btn:hover { background: #fff; transform: translateY(-2px); }

        .pop-out {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--success);
            color: #000;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 700;
            transform: translateY(100px);
            opacity: 0;
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 2000;
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
        }

        .pop-out.show {
            transform: translateY(0);
            opacity: 1;
        }

        .success-container {
            text-align: center;
            padding: 100px 5%;
        }

        .success-icon {
            font-size: 60px;
            color: var(--success);
            margin-bottom: 20px;
            font-family: 'JetBrains Mono', monospace;
        }

        .flag-box {
            background: #000;
            border: 1px solid var(--accent);
            padding: 24px;
            border-radius: 8px;
            margin-top: 40px;
            display: inline-block;
            box-shadow: 0 0 30px rgba(255, 0, 85, 0.2);
        }

        .flag-box h3 { color: var(--accent); margin: 0 0 10px; font-size: 14px; letter-spacing: 2px; font-family: 'JetBrains Mono', monospace; }
        .flag-text { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: bold; color: #fff; }

        .system-footer {
            margin-top: 60px;
            padding: 15px;
            background: rgba(255,255,255,0.02);
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: #444;
            border-radius: 6px;
            text-align: left;
        }
    </style>
</head>
<body>

    <nav class="navbar">
        <div class="logo">> PHANTOM.TECH</div>
        <div class="nav-links">
            <div class="cart-trigger" onclick="toggleCart(true)">
                <span>// SHOPPING_CART</span>
                <span class="cart-badge" id="cart-count">0</span>
            </div>
        </div>
    </nav>

    <section class="hero">
        <h1>TRUST IS A VULNERABILITY.</h1>
        <p>> Elite hardware for the modern breach. Every system has a price point. What's yours?</p>
    </section>

    <div class="container">
        <!-- LEFT COLUMN: PRODUCTS -->
        <div class="main-content">
            <div class="product-grid">
                {% for id, p in products.items() %}
                <div class="product-card">
                    <div style="width: 100%; height: 200px; background: #000; position: relative; border-bottom: 1px solid var(--border); overflow: hidden;">
                        <img src="{{ p.image }}" alt="{{ p.name }}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: 0.3s;">
                    </div>
                    <div style="padding: 20px;">
                        <span style="font-size: 10px; text-transform: uppercase; color: var(--primary); font-weight: 700; letter-spacing: 1.5px; font-family: 'JetBrains Mono';">// {{ p.category }}</span>
                        <h3 style="font-size: 18px; font-weight: 600; margin: 6px 0;">{{ p.name }}</h3>
                        <p style="font-size: 12px; color: var(--muted); margin-bottom: 20px; line-height: 1.5;">{{ p.desc }}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 20px; font-weight: 800; font-family: 'JetBrains Mono';">${{ p.price }}</span>
                            <button class="add-btn" onclick="addToCart('{{ id }}', '{{ p.name }}', {{ p.price }})" style="background: var(--primary); color: #000; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 700; cursor: pointer;">ADD_TO_CART</button>
                        </div>
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>

        <!-- RIGHT COLUMN: PERSISTENT TRANSACTION MONITOR (CLIENT-SIDE) -->
        <div class="side-panel">
            <div class="logs-panel">
                <div class="logs-panel-header">
                    <span>> UPLINK_TRANSACTION_MONITOR</span>
                    <button onclick="clearLogs()" style="background:none; border:none; color: var(--accent); font-family: 'JetBrains Mono'; font-size: 9px; cursor: pointer;">[CLEAR]</button>
                </div>
                <div class="logs-panel-content" id="audit-log">
                    <!-- Logs injected by pollers -->
                </div>
                <div style="padding: 10px 20px; border-top: 1px solid var(--border); background: rgba(255,255,255,0.02); font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono';">
                    [ STATUS ]: MONITORING_CLIENT_REQUESTS...<br>
                    [ TRACE ]: LOCAL_CLIENT_UPLINK
                </div>
            </div>

            <!-- EDITABLE EXPLOIT REFERENCE SECTION -->
            <div style="margin-top: 20px; background: #000; border: 1px solid var(--border); border-radius: 8px; overflow: hidden;">
                <div style="background: var(--border); padding: 8px 15px; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: bold; color: var(--warning);">
                    > EXPLOIT_REFERENCE (EDITABLE)
                </div>
                <div contenteditable="true" style="padding: 15px; font-family: 'JetBrains Mono'; font-size: 11px; color: #00ff88; background: #050506; line-height: 1.6; outline: none;">
                    <span style="color: #fff;">Product-Agnostic Exploit:</span><br><br>
                    curl -X POST http://localhost:9090/checkout \<br>
                    -H "Content-Type: application/json" \<br>
                    -d '{"product":"ANY_PRODUCT_NAME", "price":1, "quantity":1}'
                </div>
                <div style="padding: 8px 15px; font-size: 9px; color: var(--muted); border-top: 1px solid var(--border);">
                    * Click text to modify parameters for live demo.
                </div>
            </div>
        </div>
    </div>

    <!-- SIDE DRAWER: SHOPPING CART -->
    <div id="cart-drawer" class="drawer">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #fff; padding-bottom: 10px;">
            <h2 style="font-family: 'JetBrains Mono'; font-size: 18px; margin: 0;">// ACTIVE_CART</h2>
            <button onclick="toggleCart(false)" style="background:none; border:none; color:#fff; cursor:pointer; font-size:20px;">✕</button>
        </div>
        <div id="cart-items" style="flex:1; overflow-y:auto;">
            <!-- Data injected by JS -->
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-family: 'JetBrains Mono'; font-size: 18px; font-weight: bold;">
                <span>TOTAL</span>
                <span id="cart-total">$0</span>
            </div>
            <button class="checkout-btn" onclick="checkout()" style="width: 100%; padding: 15px; background: var(--success); color: #000; border: none; border-radius: 4px; font-weight: 800; cursor: pointer;">EXECUTE_PAYMENT</button>
        </div>
    </div>

    <div id="toast-notification" class="toast">PURCHASE_COMPLETE // 💳</div>

    <script>
        let cart = JSON.parse(localStorage.getItem('phantom_cart') || '[]');
        updateCartDisplay();
        pollAuditLog();

        function toggleCart(open) { document.getElementById('cart-drawer').classList.toggle('open', open); }

        function addToCart(id, name, price) {
            cart.push({ id, name, price });
            localStorage.setItem('phantom_cart', JSON.stringify(cart));
            updateCartDisplay();
            showPopup("ITEM IS ADDED");
        }

        function showPopup(msg) {
            const toast = document.getElementById('toast-notification');
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function updateCartDisplay() {
            const count = document.getElementById('cart-count');
            if(count) count.innerText = cart.length;
            
            const itemContainer = document.getElementById('cart-items');
            if(itemContainer) {
                itemContainer.innerHTML = '';
                let total = 0;
                cart.forEach((item, index) => {
                    total += item.price;
                    itemContainer.innerHTML += `
                        <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--border);">
                            <div>
                                <h4 style="margin: 0; font-size: 14px;">${item.name}</h4>
                                <p style="margin: 4px 0; color: var(--primary); font-size: 13px; font-family: 'JetBrains Mono';">$${item.price}</p>
                            </div>
                            <button onclick="removeItem(${index})" style="background:none; border:none; color:var(--accent); cursor:pointer;">[X]</button>
                        </div>
                    `;
                });
                document.getElementById('cart-total').innerText = '$' + total;
            }
        }

        function removeItem(index) {
            cart.splice(index, 1);
            localStorage.setItem('phantom_cart', JSON.stringify(cart));
            updateCartDisplay();
        }

        function clearLogs() { fetch('/clear_logs', { method: 'POST' }).then(() => pollAuditLog()); }

        function pollAuditLog() {
            fetch('/transactions')
                .then(res => res.json())
                .then(data => {
                    const logContainer = document.getElementById('audit-log');
                    if(!logContainer) return;
                    logContainer.innerHTML = data.length === 0 ? '<div style="color:var(--muted); text-align:center; padding:40px;">[WAITING_FOR_DATA]</div>' : 
                        data.map(tx => `
                            <div style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:2px;">
                                <div style="display:flex; justify-content:space-between; color:var(--muted); font-size:10px;">
                                    <span>[${tx.time}] ID:TX_${Math.floor(Math.random()*10000)}</span>
                                    <span style="color:${tx.price <= 1 ? 'var(--accent)' : 'var(--success)'}">[${tx.price <= 1 ? 'BREACH' : 'OK'}]</span>
                                </div>
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:#fff;">${tx.product}</span>
                                    <span style="font-weight:bold; color:var(--primary)">$${tx.price}</span>
                                </div>
                            </div>
                        `).join('');
                });
        }

        setInterval(pollAuditLog, 3000);

        function checkout() {
            if(cart.length === 0) return;
            const item = cart[0]; 
            fetch('/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: item.name, price: item.price, quantity: 1 })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    cart = [];
                    localStorage.removeItem('phantom_cart');
                    updateCartDisplay();
                    toggleCart(false);
                    pollAuditLog();
                    if(data.amount <= 1) {
                        alert("🚨 SYSTEM_BREACH_DETECTED! \\nIntegrity check bypassed. Price field trusted from client. \\n\\nFlag revealed: FLAG{business_logic_price_tampering}");
                    } else {
                        showPopup("PURCHASE_COMPLETE // 💳");
                    }
                }
            });
        }
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, page='home', products=PRODUCTS, transactions=TRANSACTIONS[::-1])

@app.route('/transactions')
def get_transactions():
    return jsonify(TRANSACTIONS[::-1])

@app.route('/clear_logs', methods=['POST'])
def clear_logs():
    TRANSACTIONS.clear()
    return jsonify({"success": True})

@app.route('/checkout', methods=['POST'])
def checkout():
    import datetime
    data = request.get_json()
    price = data.get('price', 0)
    product = data.get('product', 'Unknown')
    
    # Log the transaction
    TRANSACTIONS.append({
        "time": datetime.datetime.now().strftime("%H:%M:%S"),
        "product": product,
        "price": price
    })
    
    return jsonify({"success": True, "amount": price, "product": product})

@app.route('/order-confirmation')
def success():
    amount = request.args.get('amount', type=int, default=0)
    return render_template_string(HTML_TEMPLATE, page='success', amount=amount)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090)
