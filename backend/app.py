import random
import time
import logging
import base64
import os
import re
import secrets
from datetime import timedelta
from flask import Flask, jsonify, request, session
from flask_mail import Mail, Message
from flask_session import Session
from flask_cors import CORS
from dotenv import load_dotenv
from cryptography.fernet import InvalidToken
from utils.encryption import PasswordEncryption

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
     origins=["http://localhost:5173",
              "https://multi-factor-authetication-password-manager.vercel.app",
              "https://multi-factor-authetication-pass-git-aa301e-ojasvsakhis-projects.vercel.app"],
     allow_headers=["Content-Type","Authorization"],
     expose_headers=["Access-Control-Allow-Origin"],
     methods=["GET", "POST", "OPTIONS"])

# Mail configuration
app.config.update(
    MAIL_SERVER=os.getenv('MAIL_SERVER'),
    MAIL_PORT=int(os.getenv('MAIL_PORT')),
    MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
    MAIL_USE_TLS=os.getenv('MAIL_USE_TLS') == 'True',
    MAIL_USE_SSL=os.getenv('MAIL_USE_SSL') == 'True',
    MAIL_DEFAULT_SENDER=os.getenv('MAIL_DEFAULT_SENDER')
)

mail = Mail(app)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def generate_otp():
    return random.randint(100000, 999999)

def send_otp_email(user_email, otp):
    try:
        if not is_valid_email(user_email):
            return False, "Invalid email address"

        msg = Message(
            'Your OTP for Accessing Password Manager',
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[user_email]
        )
        msg.body = (
            f'Your One-Time Password (OTP) is: {otp}\n\n'
            'This OTP is valid for the next 5 minutes.\n'
            'If you did not request this OTP, please ignore this email.\n\n'
            'Thank you.'
        )
        
        mail.send(msg)
        return True, "OTP sent successfully"
    except Exception as e:
        return False, str(e)

@app.route('/api/verify-master-key', methods=['POST'])
def verify_master_key():
    try:
        data = request.get_json()
        master_password = data.get('masterPassword')
        stored_salt = session.get('encryption_salt')
        
        if not master_password:
            return jsonify({'error': 'Master password is required'}), 400

        if not stored_salt:
            return jsonify({'error': 'No master key has been generated'}), 400
        
        salt = base64.urlsafe_b64decode(stored_salt.encode())
        key, _ = PasswordEncryption.generate_key(master_password, salt)
        
        session['master_key_verified'] = True
        return jsonify({'message': 'Master key verified successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        otp = generate_otp()
        success, message = send_otp_email(email, otp)
        
        if success:
            session.permanent = True
            session['email'] = email
            session['otp'] = str(otp)
            session['otp_expires'] = time.time() + 300
            return jsonify({'message': 'OTP sent successfully', 'email': email}), 200
        else:
            return jsonify({'error': message}), 500
            
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        entered_otp = str(data.get('otp'))
        
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
            return jsonify({'status': 'success', 'message': 'OTP verified successfully', 'email': email}), 200
        
        return jsonify({'error': 'Invalid OTP'}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
