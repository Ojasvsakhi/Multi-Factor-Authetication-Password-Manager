import random
import time
from flask import Flask, jsonify, request, session
from flask_mail import Mail, Message
import bcrypt
from flask_session import Session
from flask_cors import CORS 
import re
from dotenv import load_dotenv
import os
from retry import retry
import logging
from datetime import timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Session configuration
app.config.update(
    SECRET_KEY=os.getenv('SECRET_KEY'),
    SESSION_TYPE='filesystem',
    SESSION_FILE_DIR='flask_session',
    SESSION_PERMANENT=True,
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=5),
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='None'
)

# Initialize Flask-Session
Session(app)

# CORS configuration
CORS(app, 
     supports_credentials=True, 
     origins=["http://localhost:5173", "https://multi-factor-authetication-password-manager.vercel.app"],
     allow_headers=["Content-Type"],
     expose_headers=["Access-Control-Allow-Origin"],
     methods=["GET", "POST", "OPTIONS"])


# Mail configuration
# Mail configuration
app.config.update(
    MAIL_SERVER=os.getenv('MAIL_SERVER'),
    MAIL_PORT=int(os.getenv('MAIL_PORT')),
    MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
    MAIL_USE_TLS=os.getenv('MAIL_USE_TLS') == 'True',
    MAIL_USE_SSL=os.getenv('MAIL_USE_SSL') == 'True',
    MAIL_DEFAULT_SENDER=('PassWord Manager', os.getenv('MAIL_DEFAULT_SENDER')),  # Changed this line
    MAIL_MAX_EMAILS=None,
    MAIL_SUPPRESS_SEND=False,
    MAIL_ASCII_ATTACHMENTS=False,
    MAIL_TIMEOUT=30  # Added timeout
)

# Initialize logging
logging.basicConfig(level=logging.INFO)

mail = Mail(app)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def generate_otp():
    return random.randint(100000, 999999)

@retry(tries=3, delay=1, backoff=2, logger=logging.getLogger(__name__))
def send_otp_email(user_email, otp):
    try:
        if not is_valid_email(user_email):
            return False, "Invalid email address"

        msg = Message(
            'Your OTP for Password Manager',
            recipients=[user_email]
        )
        msg.body = (
            f'Your One-Time Password (OTP) is: {otp}\n\n'
            'This OTP is valid for the next 5 minutes.\n'
            'If you did not request this OTP, please ignore this email.\n\n'
            'Thank you,\n'
            'Password Manager Team'
        )
        
        with app.app_context():  # Added app context
            mail.send(msg)
            logging.info(f"OTP sent successfully to {user_email}")
        return True, "OTP sent successfully"
    except Exception as e:
        logging.error(f"Failed to send OTP: {str(e)}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'session_active': 'email' in session}), 200

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Clear any existing session data
        session.clear()
        
        otp = generate_otp()
        success, message = send_otp_email(email, otp)
        
        if success:
            session.permanent = True
            session['email'] = email
            session['otp'] = str(otp)
            session['otp_expires'] = time.time() + 300
            
            logging.info(f"Session data stored for {email}")
            
            return jsonify({
                'message': 'OTP sent successfully',
                'email': email
            }), 200
        else:
            logging.error(f"Failed to send OTP: {message}")
            return jsonify({'error': message}), 500
            
    except Exception as e:
        logging.error(f"Error in send_otp: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        entered_otp = str(data.get('otp'))
        if not entered_otp:
            return jsonify({'error': 'OTP is required'}), 400

        print(f"Current session: {dict(session)}")

        email = session.get('email')
        stored_otp = session.get('otp')
        otp_expires = session.get('otp_expires')
        
        if not all([email, stored_otp, otp_expires]):
            return jsonify({'error': 'No active OTP session'}), 400
        
        if time.time() > otp_expires:
            session.pop('email', None)
            session.pop('otp', None)
            session.pop('otp_expires', None)
            return jsonify({'error': 'OTP has expired'}), 400
        
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

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200
if __name__ == '__main__':
    app.run(debug=True)