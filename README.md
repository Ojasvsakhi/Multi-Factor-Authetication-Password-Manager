# Multi-Factor Authentication Password Manager

A secure password management system with multi-factor authentication, built using React, Flask, and PostgreSQL. Features multiple encryption algorithms and enhanced security measures.

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashBoard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OtpFlow.jsx
│   │   │   ├── PasswordVault.jsx
│   │   │   └── EncryptionSettings.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── app.py
    ├── models/
    │   ├── __init__.py
    │   ├── user.py
    │   └── password.py
    ├── utils/
    │   ├── encryption.py
    │   └── validators.py
    ├── requirements.txt
    ├── .env
    └── static/
        └── images/
```

## Features

- **Multi-Factor Authentication**: 
  - Email-based OTP verification
  - Master Key authentication
  - Anti-phishing measures

- **Password Management**:
  - Secure password vault
  - Multiple encryption options (AES-256 and more)
  - Dummy password protection
  - Password strength analyzer

- **Security Features**:
  - Master key protection
  - Dummy password dashboard for security
  - Multiple encryption algorithm choices
  - Session management
  - CORS protection

## Tech Stack

### Frontend
- React 18.2.0
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation
- Vite for build tooling

### Backend
- Flask
- Flask-SQLAlchemy
- PostgreSQL
- Flask-Mail for email services
- Cryptography libraries

### Database
- PostgreSQL
- SQLAlchemy ORM

## Project Progress

### Completed Features ✅
- Basic project structure setup
- Frontend React components scaffolding
- Backend Flask API setup
- Email OTP system implementation
### In Progress 
- Password strength analyzer
- Password generation tools
- Frontend
### Upcoming Features 
- Password vault implementation
- Multiple encryption algorithms integration
- Master key authentication system
- Dummy password dashboard
- User settings management
- Password sharing capabilities
- Browser extension integration
- Backup and restore functionality

### Development Timeline
- **Phase 1** (Completed):
  - Project setup
  - Basic authentication
  
- **Phase 2** (Current):
  - Database models
  - Password vault
  - Encryption systems
  - Security features
  
- **Phase 3** (Planned):
  - Advanced features
  - Testing & optimization
  - Documentation

### Known Issues 
1. OTP email delivery delays in some cases
2. Session persistence issues after browser refresh
3. Password strength meter accuracy improvements needed

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm
- PostgreSQL
- Gmail account for OTP service

### Installation

1. Backend Setup:
```bash
cd backend
pip install -r requirements.txt
```

2. Configure Backend Environment:
Create `.env` file in backend directory with:
```
SECRET_KEY=your_secret_key
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
```

3. Setup PostgreSQL Database:
```bash
createdb password_manager
python manage.py db upgrade
```

4. Frontend Setup:
```bash
cd frontend
npm install
```

### Running the Application

1. Start Backend:
```bash
cd backend
python app.py
```

2. Start Frontend:
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## Security Features

### Encryption Options
- AES-256 (Default)
- Blowfish
- Twofish
- ChaCha20

### Anti-Phishing Measures
- Dummy password dashboard
- Fake master key protection
- Session-based authentication
- Time-based OTP expiration

## API Endpoints

- POST `/api/auth/register`: User registration
- POST `/api/auth/login`: User login
- POST `/api/auth/send-otp`: Send OTP
- POST `/api/auth/verify-otp`: Verify OTP
- GET `/api/passwords`: Get stored passwords
- POST `/api/passwords`: Add new password
- PUT `/api/passwords/{id}`: Update password
- DELETE `/api/passwords/{id}`: Delete password
- GET `/api/encryption/algorithms`: Available encryption algorithms
