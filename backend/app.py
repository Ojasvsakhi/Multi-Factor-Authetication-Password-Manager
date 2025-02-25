import random
import time
from flask import Flask, jsonify, request, session
from flask_mail import Mail, Message
import bcrypt
from flask_cors import CORS 
import re
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure using environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL') == 'True'
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')


mail = Mail(app)

# Your existing helper functions
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def generate_otp():
    return random.randint(100000, 999999)

def send_otp_email(user_email, otp):
    try:
        msg = Message(
            'Your OTP for Accessing Password Manager',
            sender='PassWord Protector <ojasvsakhi1@gmail.com>',
            recipients=[user_email]
        )
        msg.body = (
            f'Your One-Time Password (OTP) is: {otp}\n\n'
            'This OTP is valid for the next 5 minutes. Please do not share it with anyone.\n'
            'If you did not request this OTP, please ignore this email or contact support.\n\n'
            'Thank you.'
        )
        if not is_valid_email(user_email):
            return False, "Invalid email address"
        mail.send(msg)
        print(f"OTP sent to {user_email}")
        return True, "OTP sent successfully"
    except Exception as e:
        print(f"Failed to send OTP to {user_email}: {e}")
        return False, str(e)

# Modified routes for API endpoints
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    otp = generate_otp()
    success, message = send_otp_email(email, otp)
    
    if success:
        session['email'] = email
        session['otp'] = str(otp)
        session['otp_expires'] = time.time() + 300  # 5 minutes expiry
        return jsonify({
            'message': 'OTP sent successfully',
            'email': email
        }), 200
    else:
        return jsonify({'error': message}), 500
@app.route('/routes', methods=['GET'])
def list_routes():
    return jsonify([str(rule) for rule in app.url_map.iter_rules()])
@app.route('/')
def home():
    return jsonify({"message": "Flask backend is running!"})
@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        entered_otp = str(data.get('otp'))
        if not entered_otp:
            return jsonify({'error': 'OTP is required'}), 400

        email = session.get('email')
        stored_otp = session.get('otp')
        otp_expires = session.get('otp_expires')
        
        # Debug logging
        print(f"Entered OTP: {entered_otp}")
        print(f"Stored OTP: {stored_otp}")
        print(f"Session data: {session}")
        
        # Check for active session first
        if not all([email, stored_otp, otp_expires]):
            return jsonify({'error': 'No active OTP session'}), 400
        
        # Check for OTP expiration
        if time.time() > otp_expires:
            session.pop('email', None)
            session.pop('otp', None)
            session.pop('otp_expires', None)
            return jsonify({'error': 'OTP has expired'}), 400
        
        # Finally verify OTP
        if entered_otp == stored_otp:
            session['otp_verified'] = True
            session.pop('otp', None)
            session.pop('otp_expires', None)
            return jsonify({
                'status': 'success',
                'message': 'OTP verified successfully',
                'email': email
            }), 200
            
        return jsonify({'error': 'Invalid OTP'}), 400

    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
if __name__ == '__main__':
    app.run(debug=True)