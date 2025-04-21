# CryptoKnight Password Manager

A secure password management system with advanced multi-factor authentication, featuring a cyberpunk-themed UI and robust security measures.

## 📁 Project Structure

```
cryptoknight/
├── frontend/
│   ├── src/
│   │   ├── Authentications/
│   │   │   ├── Email.tsx               # Email verification component
│   │   │   ├── EmailVerification.tsx   # OTP verification component
│   │   │   ├── ImageGridCaptcha.tsx    # Pattern/Grid verification
│   │   │   └── Username_masterkey.tsx  # Credentials setup component
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Main dashboard
│   │   │   ├── PrimaryLogin.tsx       # Initial login page
│   │   │   ├── Register.tsx           # User registration
│   │   │   ├── PasswordVault.tsx      # Password management
│   │   │   └── EncryptionSettings.tsx # Security settings
│   │   ├── services/
│   │   │   └── api.ts                 # API integration
│   │   └── App.tsx                    # Main application component
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app.py                         # Main Flask application
│   ├── database.py                    # Database configuration
│   ├── requirements.txt
│   └── static/
│       └── images/                    # Captcha & assets
│
└── README.md
```

This shows the main components and their purposes in the application architecture.
## Core Features

### Multi-Factor Authentication 
- ✅ Username/Master Key authentication
- ✅ Email-based OTP verification
- ✅ Pattern/Image Grid CAPTCHA verification
- ✅ Real-time security monitoring

### Password Management
- ✅ Password strength analysis with visual feedback
- ✅ Secure password vault with categorization
- ✅ Password generation with customizable options
- ✅ Encrypted storage with multiple security levels

### Security Features
- ✅ Session-based authentication
- ✅ Navigation protection
- ✅ Auto-lock functionality
- ✅ Real-time security alerts
- ✅ Multiple encryption strength options

### User Interface
- ✅ Cyberpunk-themed design
- ✅ Responsive layout
- ✅ Interactive animations
- ✅ Visual feedback for actions
- ✅ Accessibility features

## Tech Stack

### Frontend
- React with TypeScript
- Framer Motion for animations
- TailwindCSS for styling
- Lucide Icons
- React Router for navigation

### Backend
- Flask
- PostgreSQL
- Flask-Mail for OTP
- SQLAlchemy

## Project Progress

### Completed ✅
- Authentication system with MFA
- Password vault implementation
- Security dashboard
- User settings & preferences
- Password strength analyzer
- Interactive UI components
- Email verification system
- Session management
- Navigation protection

### In Development 🔄
- Password sharing functionality
- Backup and restore features
- Advanced encryption options
- Activity logging system

## Getting Started

### Prerequisites
- Node.js
- Python 3.x
- PostgreSQL
- SMTP server access for OTP

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ojasvsakhi/Multi-Factor-Authetication-Password-Manager.git
```

2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

3. Backend Setup:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Access the application at `http://localhost:5173`

## Security Implementation

### Authentication Flow
1. Primary Login (Username/Master Key)
2. Email OTP Verification
3. Pattern/Grid Verification
4. Session Establishment

### Encryption Levels
- Standard (Default)
- Enhanced
- Maximum Security

### Session Security
- Auto-lock after inactivity
- Secure session management
- Browser close protection
- Navigation protection

## Screenshots
[Add screenshots of key features]

## Contributing
[Add contribution guidelines]

## License
[Add license information]
