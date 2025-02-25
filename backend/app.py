import random
import time
import os
import re
from flask import Flask, jsonify, request, session
from flask_mail import Mail, Message
from flask_session import Session
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["https://multi-factor-authetication-password-manager.vercel.app"])

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'defaultsecretkey')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'otp_'
Session(app)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL') == 'True'
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)


def is_valid_email(email):
    """Validate email format."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def generate_otp():
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))

def send_otp_email(user_email, otp):
    """Send OTP to the user's email."""
    if not is_valid_email(user_email):
        return False, "Invalid email address"
    
    try:
        msg = Message(
            subject='Your OTP for Accessing Password Manager',
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user_email]
        )
        msg.body = (
            f'Your One-Time Password (OTP) is: {otp}\n\n'
            'This OTP is valid for the next 5 minutes. Please do not share it with anyone.\n'
            'If you did not request this OTP, please ignore this email or contact support.\n\n'
            'Thank you.'
        )
        mail.send(msg)
        print(f"✅ OTP sent to {user_email}")
        return True, "OTP sent successfully"
    except Exception as e:
        print(f"❌ Failed to send OTP to {user_email}: {e}")
        return False, str(e)

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Generate and send OTP to user's email."""
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    otp = generate_otp()
    success, message = send_otp_email(email, otp)

    if success:
        session['email'] = email
        session['otp'] = otp
        session['otp_expires'] = time.time() + 300  # 5 minutes expiry
        return jsonify({'message': 'OTP sent successfully', 'email': email}), 200
    else:
        return jsonify({'error': message}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verify the OTP entered by the user."""
    data = request.get_json()
    entered_otp = str(data.get('otp'))

    if not entered_otp:
        return jsonify({'error': 'OTP is required'}), 400

    email = session.get('email')
    stored_otp = session.get('otp')
    otp_expires = session.get('otp_expires')

    # Debug logging
    print(f"🔍 Entered OTP: {entered_otp}")
    print(f"💾 Stored OTP: {stored_otp}")
    print(f"⏳ OTP Expiry Time: {otp_expires} | Current Time: {time.time()}")

    # Check if OTP session exists
    if not all([email, stored_otp, otp_expires]):
        return jsonify({'error': 'No active OTP session'}), 400

    # Check if OTP has expired
    if time.time() > otp_expires:
        session.clear()
        return jsonify({'error': 'OTP has expired'}), 400

    # Verify OTP
    if entered_otp == stored_otp:
        session['otp_verified'] = True
        session.pop('otp', None)
        session.pop('otp_expires', None)
        return jsonify({'status': 'success', 'message': 'OTP verified successfully', 'email': email}), 200

    return jsonify({'error': 'Invalid OTP'}), 400

@app.route('/')
def home():
    """Check if Flask backend is running."""
    return jsonify({"message": "Flask backend is running!"})

@app.route('/routes', methods=['GET'])
def list_routes():
    """List all available routes for debugging."""
    return jsonify([str(rule) for rule in app.url_map.iter_rules()])

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
