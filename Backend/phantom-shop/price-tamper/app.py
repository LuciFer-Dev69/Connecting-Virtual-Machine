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

        .container { padding: 0 5% 100px; }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            margin-top: 40px;
        }

        .product-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }

        .product-card:hover {
            transform: translateY(-8px);
            border-color: var(--primary);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }

        .image-container {
            width: 100%;
            height: 220px;
            overflow: hidden;
            background: #000;
            position: relative;
            border-bottom: 1px solid var(--border);
        }

        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.5s;
            opacity: 0.7;
        }

        .product-card:hover .image-container img {
            transform: scale(1.05);
            opacity: 1;
        }

        .product-content { padding: 20px; }

        .product-category {
            font-size: 10px;
            text-transform: uppercase;
            color: var(--primary);
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            font-family: 'JetBrains Mono', monospace;
        }

        .product-name { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
        .product-desc { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
        
        .product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .price { font-size: 22px; font-weight: 800; font-family: 'JetBrains Mono', monospace; }

        .add-btn {
            background: var(--primary);
            color: #000;
            border: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
            font-size: 13px;
        }

        .add-btn:hover {
            background: #fff;
            box-shadow: 0 0 15px rgba(255,255,255,0.4);
        }

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

        /* Pop-out Animation for Cart */
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
        <div class="cart-trigger" onclick="toggleDrawer(true)">
            <span>// SHOPPING_CART</span>
            <span class="cart-badge" id="cart-count">0</span>
        </div>
    </nav>

    {% if page == 'success' %}
        <div class="success-container">
            <div class="success-icon">[ TRANSACTION_CONFIRMED ]</div>
            <h1>ORDER SECURED</h1>
            <p>Order processed for <span style="color: var(--primary)">${{ amount }}</span>.</p>
            
            {% if amount <= 1 %}
                <div class="flag-box">
                    <h3>// SYSTEM_BREACH_DETECTED</h3>
                    <div class="flag-text">🚩 FLAG{business_logic_price_tampering}</div>
                </div>
            {% else %}
                <p style="color: var(--muted); margin-top: 40px;">* SYSTEM_LOG: Integrity check passed. Full market value paid.</p>
            {% endif %}
            <br><br>
            <button class="add-btn" onclick="window.location.href='/'" style="width: auto; padding: 12px 30px;">// BACK_TO_SHOP</button>
        </div>
    {% else %}
        <section class="hero">
            <h1>TRUST IS A VULNERABILITY.</h1>
            <p>> Elite hardware for the modern breach. Every system has a price point. What's yours?</p>
        </section>

        <div class="container">
            <div class="product-grid">
                {% for id, p in products.items() %}
                <div class="product-card">
                    <div class="image-container">
                        <img src="{{ p.image }}" alt="{{ p.name }}">
                    </div>
                    <div class="product-content">
                        <span class="product-category">// {{ p.category }}</span>
                        <h3 class="product-name">{{ p.name }}</h3>
                        <p class="product-desc">{{ p.desc }}</p>
                        <div class="product-footer">
                            <span class="price">${{ p.price }}</span>
                            <button class="add-btn" onclick="addToCart('{{ id }}', '{{ p.name }}', {{ p.price }})">ADD_TO_CART</button>
                        </div>
                    </div>
                </div>
                {% endfor %}
            </div>

            <div class="system-footer">
                [SYSTEM_CMD]: Connecting to secure_checkout_v4.2...<br>
                [VERIFYING]: Authentication handled by client_logic.js<br>
                [DEBUG]: Payload validation: NONE (Price field trusted for performance)
            </div>
        </div>

        <div id="cart-drawer">
            <div class="drawer-header">
                <h2>// ACTIVE_CART</h2>
                <button class="close-drawer" onclick="toggleDrawer(false)">X</button>
            </div>
            <div id="cart-items">
                <!-- Data injected by JS -->
            </div>
            <div class="checkout-footer">
                <div class="total-row">
                    <span>SUBTOTAL</span>
                    <span id="cart-total">$0</span>
                </div>
                <button class="checkout-btn" onclick="checkout()">EXECUTE_CHECKOUT</button>
            </div>
        </div>

        <div id="pop-out" class="pop-out">STATUS: ITEM_ADDED // 🛒</div>
    {% endif %}

    <script>
        let cart = JSON.parse(localStorage.getItem('phantom_cart') || '[]');
        updateCartDisplay();

        function toggleDrawer(open) {
            document.getElementById('cart-drawer').classList.toggle('open', open);
        }

        function addToCart(id, name, price) {
            cart.push({ id, name, price });
            localStorage.setItem('phantom_cart', JSON.stringify(cart));
            updateCartDisplay();
            
            const pop = document.getElementById('pop-out');
            pop.classList.add('show');
            setTimeout(() => pop.classList.remove('show'), 2000);
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
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <p>$${item.price}</p>
                            </div>
                            <button onclick="removeItem(${index})" style="background:none; border:none; color:var(--accent); cursor:pointer; font-family:'JetBrains Mono'; font-size:11px;">[ REMOVE ]</button>
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

        function checkout() {
            if(cart.length === 0) return alert("System Error: No items detected in cart.");
            
            // INTENTIONAL VULNERABILITY
            const item = cart[0]; 
            
            fetch('/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: item.name,
                    price: item.price,
                    quantity: 1
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    localStorage.removeItem('phantom_cart');
                    window.location.href = '/order-confirmation?amount=' + data.amount;
                }
            });
        }
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, page='home', products=PRODUCTS)

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    price = data.get('price', 0)
    product = data.get('product', 'Unknown')
    return jsonify({"success": True, "amount": price, "product": product})

@app.route('/order-confirmation')
def success():
    amount = request.args.get('amount', type=int, default=0)
    return render_template_string(HTML_TEMPLATE, page='success', amount=amount)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9090)
