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

class Password(db.Model):
    __tablename__ = 'passwords'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service = db.Column(db.String(255), nullable=False)  # Changed from website
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.Text, nullable=False)  # Stored encrypted
    category = db.Column(db.String(50), nullable=False)  # Added category
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert password object to dictionary"""
        return {
            'id': self.id,
            'service': self.service,
            'username': self.username,
            'password': self.password,
            'category': self.category,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
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
                
            # Add debug logging
            matrix_str = ''.join([''.join(map(str, row)) for row in matrix])
            logging.info(f"Setting matrix pattern: {matrix_str}")
            
            self.matrix_pattern = matrix_str
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
            
            # Add debug logging
            submitted = ''.join([''.join(map(str, row)) for row in matrix])
            stored = self.matrix_pattern
            logging.info(f"Stored pattern: {stored}")
            logging.info(f"Submitted pattern: {submitted}")
            logging.info(f"Match result: {submitted == stored}")
            
            return submitted == stored
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
    def get_passwords(self):
        """Get all passwords for the user"""
        return [password.to_dict() for password in self.passwords]

    def add_password(self, service: str, username: str, password: str, category: str) -> Password:
        """Add a new password for the user"""
        try:
            # Here you should encrypt the password before storing
            # Using self.master_key_hash for encryption
            new_password = Password(
                user_id=self.id,
                service=service,
                username=username,
                password=password,  # Should be encrypted
                category=category
            )
            db.session.add(new_password)
            db.session.commit()
            return new_password
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error adding password: {str(e)}")
            raise

    def get_password_by_service(self, service: str):
        """Get passwords filtered by service name"""
        return [p.to_dict() for p in self.passwords if p.service.lower() == service.lower()]

    def search_passwords(self, query: str):
        """Search passwords by service or username"""
        query = query.lower()
        return [p.to_dict() for p in self.passwords 
                if query in p.service.lower() or 
                   query in p.username.lower()]

    def delete_password(self, password_id: int) -> bool:
        """Delete a password by ID"""
        try:
            password = Password.query.filter_by(id=password_id, user_id=self.id).first()
            if password:
                db.session.delete(password)
                db.session.commit()
                return True
            return False
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error deleting password: {str(e)}")
            return False
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
            # Create new tables
            db.create_all()
            logging.info("Database tables created successfully")
        except Exception as e:
            logging.error(f"Error initializing database: {str(e)}")
            raise