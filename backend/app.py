import random
import time
import logging
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from cryptography.fernet import InvalidToken
import re
from flask import Flask, jsonify, request, session
from flask_mail import Mail, Message
import bcrypt
from flask_session import Session
from flask_cors import CORS 
import re
import base64
from dotenv import load_dotenv
import os
from datetime import timedelta
from utils.encryption import PasswordEncryption
import secrets
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
        print(f"OTP sent to {user_email}")
        return True, "OTP sent successfully"
    except Exception as e:
        print(f"Failed to send OTP: {str(e)}")
        return False, str(e)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'session_active': 'email' in session}), 200

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        if not session.get('master_key_verified'):
            return jsonify({'error': 'Master key verification required'}), 401
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        otp = generate_otp()
        success, message = send_otp_email(email, otp)
        
        if success:
            session.permanent = True
            session['email'] = email
            session['otp'] = str(otp)
            session['otp_expires'] = time.time() + 300
            
            print(f"Session data stored: {dict(session)}")
            
            return jsonify({
                'message': 'OTP sent successfully',
                'email': email
            }), 200
        else:
            return jsonify({'error': message}), 500
            
    except Exception as e:
        print(f"Error in send_otp: {str(e)}")
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
@app.route('/api/generate-master-key', methods=['POST'])
def generate_master_key():
    try:
        data = request.get_json()
        master_password = data.get('masterPassword')
        
        if not master_password:
            return jsonify({'error': 'Master password is required'}), 400

        # Generate a new encryption key and salt
        key, salt = PasswordEncryption.generate_key(master_password)
        
        # Store salt in session for future use
        session['encryption_salt'] = base64.urlsafe_b64encode(salt).decode()
        
        return jsonify({
            'message': 'Master key generated successfully'
        }), 200

    except Exception as e:
        print(f"Error generating master key: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/encrypt-password', methods=['POST'])
def encrypt_password():
    try:
        if 'otp_verified' not in session:
            return jsonify({'error': 'OTP verification required'}), 401

        data = request.get_json()
        password = data.get('password')
        master_password = data.get('masterPassword')
        
        if not all([password, master_password]):
            return jsonify({'error': 'Password and master password are required'}), 400

        # Retrieve salt from session
        salt = base64.urlsafe_b64decode(session['encryption_salt'].encode())
        
        # Regenerate encryption key using master password and stored salt
        key, _ = PasswordEncryption.generate_key(master_password, salt)
        
        # Encrypt the password
        encrypted_password = PasswordEncryption.encrypt_password(password, key)
        
        return jsonify({
            'encryptedPassword': encrypted_password
        }), 200

    except Exception as e:
        print(f"Error encrypting password: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/decrypt-password', methods=['POST'])
def decrypt_password():
    try:
        if 'otp_verified' not in session:
            return jsonify({'error': 'OTP verification required'}), 401

        data = request.get_json()
        encrypted_password = data.get('encryptedPassword')
        master_password = data.get('masterPassword')
        
        if not all([encrypted_password, master_password]):
            return jsonify({'error': 'Encrypted password and master password are required'}), 400

        salt = base64.urlsafe_b64decode(session['encryption_salt'].encode())
        
        key, _ = PasswordEncryption.generate_key(master_password, salt)
        
        decrypted_password = PasswordEncryption.decrypt_password(encrypted_password, key)
        
        return jsonify({
            'decryptedPassword': decrypted_password
        }), 200

    except Exception as e:
        print(f"Error decrypting password: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
@app.route('/api/verify-master-key', methods=['POST'])
def verify_master_key():
    try:
        data = request.get_json()
        master_key = data.get('masterKey')
        
        if not master_key:
            return jsonify({'error': 'Master key is required'}), 400
            
        # For demo, using a fixed master key. In production, this should be stored securely
        CORRECT_MASTER_KEY = "SecretMasterKey123"  # Store this securely in environment variables
        
        if master_key == CORRECT_MASTER_KEY:
            session['master_key_verified'] = True
            return jsonify({
                'status': 'success',
                'message': 'Master key verified successfully'
            }), 200
        else:
            return jsonify({'error': 'Invalid master key'}), 401
            
    except Exception as e:
        print(f"Error in verify_master_key: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)