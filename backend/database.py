from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv
import bcrypt
import uuid
# Load environment variables
load_dotenv()

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True)
    master_key = db.Column(db.String(128))
    last_known_location = db.Column(db.String(255))
    puzzle_completed = db.Column(db.Boolean, default=False)
    otp_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    passwords = db.relationship('Password', backref='user', lazy=True)

    def __init__(self, email: str):
        self.email = email
        self.uid = str(uuid.uuid4())

    def set_master_key(self, master_key: str):
        salt = bcrypt.gensalt()
        self.master_key_hash = bcrypt.hashpw(master_key.encode('utf-8'), salt)

    def verify_master_key(self, master_key: str) -> bool:
        if not self.master_key_hash:
            return False
        return bcrypt.checkpw(master_key.encode('utf-8'), self.master_key_hash)

    def update_location(self, location: str):
        self.last_known_location = location
        db.session.commit()

    def complete_puzzle(self):
        self.puzzle_completed = True
        db.session.commit()

    @staticmethod
    def get_by_email(email: str) -> 'User':
        return User.query.filter_by(email=email).first()

    @staticmethod
    def create_user(email: str) -> 'User':
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
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///passwordmanager.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    # Create tables
    with app.app_context():
        db.create_all()