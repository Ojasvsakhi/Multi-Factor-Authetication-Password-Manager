from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv
import bcrypt
import uuid
import logging
# Load environment variables
load_dotenv()

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True)
    master_key_hash = db.Column(db.String(128))
    matrix_pattern = db.Column(db.String(36))  # Store 6x6 binary matrix
    image_index = db.Column(db.Integer)  # Add image index field
    puzzle_completed = db.Column(db.Boolean, default=False)
    otp_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    passwords = db.relationship('Password', backref='user', lazy=True)

    def __init__(self, email: str):
        self.email = email
        self.uid = str(uuid.uuid4())

    def set_master_key(self, master_key: str):
        """Hash and store the master key"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(master_key.encode('utf-8'), salt)
        self.master_key_hash = hashed.decode('utf-8')

    def verify_master_key(self, master_key: str) -> bool:
        """Verify the master key"""
        if not self.master_key_hash:
            logging.error(f"No master key hash found for user: {self.username}")
            return False
        try:
            stored_hash = self.master_key_hash.encode('utf-8')
            result = bcrypt.checkpw(master_key.encode('utf-8'), stored_hash)
            logging.info(f"Master key verification for {self.username}: {result}")
            return result
        except Exception as e:
            logging.error(f"Master key verification error for {self.username}: {str(e)}")
            return False

    def set_matrix_pattern(self, matrix: list) -> bool:
        """Store the matrix pattern"""
        try:
            if not matrix or len(matrix) != 6 or any(len(row) != 6 for row in matrix):
                logging.error("Invalid matrix format")
                return False
            matrix_str = ''.join([''.join(map(str, row)) for row in matrix])
            self.matrix_pattern = matrix_str
            db.session.commit()
            return True
        except Exception as e:
            logging.error(f"Error setting matrix pattern: {str(e)}")
            return False

    def verify_matrix_pattern(self, matrix: list) -> bool:
        """Verify the submitted matrix pattern"""
        try:
            if not self.matrix_pattern:
                logging.error(f"No matrix pattern found for user: {self.username}")
                return False
            submitted = ''.join([''.join(map(str, row)) for row in matrix])
            return submitted == self.matrix_pattern
        except Exception as e:
            logging.error(f"Matrix verification error for {self.username}: {str(e)}")
            return False

    def complete_puzzle(self):
        """Mark puzzle as completed"""
        self.puzzle_completed = True
        db.session.commit()
    def set_image_index(self, index: int) -> bool:
        """Store the image index"""
        try:
            if not isinstance(index, int) or index < 0 or index > 5:
                logging.error("Invalid image index")
                return False
            self.image_index = index
            return True
        except Exception as e:
            logging.error(f"Error setting image index: {str(e)}")
            return False

    def get_image_index(self) -> int:
        """Get the stored image index"""
        return self.image_index
    @staticmethod
    def get_by_email(email: str) -> 'User':
        """Get user by email"""
        return User.query.filter_by(email=email).first()
    @staticmethod
    def get_by_username(username: str) -> 'User':
        """Get user by username"""
        return User.query.filter_by(username=username).first()
    @staticmethod
    def create_user(email: str) -> 'User':
        """Create new user"""
        user = User(email=email)
        db.session.add(user)
        db.session.commit()
        return user
class Password(db.Model):
    __tablename__ = 'passwords'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    website = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(255), nullable=False)
    encrypted_password = db.Column(db.Text, nullable=False)
    salt = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def init_db(app):
    # Database configuration
    database_url = os.getenv('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Create tables with all columns
    with app.app_context():
        try:
            # Drop existing tables
            db.drop_all()
            # Create new tables
            db.create_all()
            logging.info("Database tables created successfully")
        except Exception as e:
            logging.error(f"Error initializing database: {str(e)}")
            raise