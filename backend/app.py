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
from database import db,init_db,User,Password
# Load environment variables
load_dotenv()

app = Flask(__name__)
init_db(app)
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
             "https://cryptknight.vercel.app"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
     methods=["GET", "POST", "OPTIONS"])
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

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    allowed_origins = [
        "http://localhost:5173",
        "https://cryptknight.vercel.app"]
    if origin in allowed_origins:
        response.headers.update({
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        })
    return response
# Initialize logging
logging.basicConfig(level=logging.INFO)

mail = Mail(app)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def generate_otp():
    return random.randint(100000, 999999)
def verify_master_credentials(username, master_key):
    try:
        # Check if username exists in database
        # Verify master key hash
        # Return True if valid, False otherwise
        return True, "Credentials verified"
    except Exception as e:
        return False, str(e)
def verify_puzzle(puzzle_solution):
    try:
        # Implement puzzle verification logic
        # Return True if solution is correct
        stored_solution = session.get('puzzle_solution')
        return puzzle_solution == stored_solution, "Puzzle verified"
    except Exception as e:
        return False, str(e)

def verify_geolocation(latitude, longitude):
    try:
        # Implement geolocation verification
        # Compare with allowed locations or previous login locations
        # Return True if location is valid
        return True, "Location verified"
    except Exception as e:
        return False, str(e)

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


# Modify send-otp route
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email')
        is_registration = data.get('isRegister', False)
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        if not is_registration:
            # Check if there's an authenticated session
            username = session.get('username')
            if not username:
                return jsonify({
                    'status': 'error',
                    'message': 'Not authenticated'
                }), 401
            
            # Verify email matches the authenticated user
            user = User.query.filter_by(username=username).first()
            if not user or user.email != email:
                return jsonify({
                    'status': 'error',
                    'message': 'Email does not match authenticated user'
                }), 401
        else:
            # Registration flow
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({
                    'status': 'error',
                    'message': 'Email already registered'
                }), 400
        
        # Generate and send OTP
        session.clear()  # Clear previous session data
        otp = generate_otp()
        success, message = send_otp_email(email, otp)
        
        if success:
            session.permanent = True
            session['email'] = email
            session['otp'] = str(otp)
            session['otp_expires'] = time.time() + 300
            session['is_registration'] = is_registration
            if not is_registration:
                session['username'] = username  # Preserve username in session
            
            logging.info(f"Session data stored for {email} - Registration: {is_registration}")
            
            return jsonify({
                'message': 'OTP sent successfully',
                'email': email,
                'is_registration': is_registration,
                'success': True
            }), 200
        else:
            logging.error(f"Failed to send OTP: {message}")
            return jsonify({'error': message, 'success': False}), 500
            
    except Exception as e:
        logging.error(f"Error in send_otp: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        entered_otp = str(data.get('otp', ''))
        email = session.get('email')
        stored_otp = session.get('otp')
        otp_expires = session.get('otp_expires')
        is_registration = session.get('is_registration', True)

        if entered_otp == stored_otp:
            session['otp_verified'] = True
            session.pop('otp', None)
            session.pop('otp_expires', None)

            # Different flows based on boolean flag
            if is_registration:
                # Check if email already exists
                existing_user = User.query.filter_by(email=email).first()
                
                if existing_user:
                    return jsonify({
                        'status': 'error',
                        'message': 'Email already registered'
                    }), 400

                # Create new user with email
                new_user = User(email=email)
                try:
                    db.session.add(new_user)
                    db.session.commit()
                    return jsonify({
                        'status': 'success',
                        'message': 'Registration OTP verified and email stored',
                        'email': email,
                        'next_step': 'create_master_credentials'
                    }), 200
                except Exception as db_error:
                    db.session.rollback()
                    logging.error(f"Database error: {str(db_error)}")
                    return jsonify({
                        'status': 'error',
                        'message': 'Failed to store user data'
                    }), 500
            else:
                return jsonify({
                    'status': 'success',
                    'message': 'Login OTP verified',
                    'email': email,
                    'next_step': 'verify_master_credentials'
                }), 200

        return jsonify({'error': 'Invalid OTP'}), 400

    except Exception as e:
        logging.error(f"Error in verify_otp: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500, 500
@app.route('/api/delete-all-users', methods=['POST'])
def delete_all_users():
    try:
        # WARNING: This deletes ALL users
        User.query.delete()
        db.session.commit()
        logging.info("All users deleted successfully")
        return jsonify({'message': 'All users deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@app.route('/api/verify-user-masterkey', methods=['POST'])
def verify_master_key():
    try:
        data = request.get_json()
        username = data.get('username')
        masterkey = data.get('masterkey')
        is_registration = data.get('is_registration', False)
        
        if not username or not masterkey:
            return jsonify({
                'status': 'error',
                'message': 'Username and master key are required'
            }), 400
        if is_registration:
            # For registration: Create new user credentials
            user = User.query.filter_by(email=session.get('email')).first()
            if not user:
                return jsonify({
                    'status': 'error',
                    'message': 'Email verification failed'
                }), 400

            user.username = username
            user.set_master_key(masterkey)  # Using the model's method
            
            try:
                db.session.commit()
                session['authenticated'] = True
                session['username'] = username
                
                return jsonify({
                    'status': 'success',
                    'message': 'Master credentials created successfully',
                    'next_step': 'dashboard'
                }), 200
            except Exception as db_error:
                db.session.rollback()
                logging.error(f"Database error: {str(db_error)}")
                return jsonify({
                    'status': 'error',
                    'message': 'Failed to store master credentials'
                }), 500
        else:
            # For login: Verify existing credentials
            user = User.query.filter_by(username=username).first()
            if not user or not user.verify_master_key(masterkey):  # Using the model's method
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid username or master key'
                }), 401

            session['authenticated'] = True
            session['username'] = username
            
            return jsonify({
                'status': 'success',
                'message': 'Authentication successful',
                'next_step': 'dashboard'
            }), 200

    except Exception as e:
        logging.error(f"Error in verify_master_key: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200
if __name__ == '__main__':
    app.run(debug=True)