# Project Title: Multifactor Authentication System

This project is a multifactor authentication system that combines a Flask backend with a React frontend. The application allows users to log in using their email, receive a One-Time Password (OTP), and verify their identity through various authentication steps.

## Project Structure

```
multifactor-authentication
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Login.jsx
│   │   │   ├── OtpVerification.jsx
│   │   │   ├── ImageAuthentication.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Passcode.jsx
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public
│   │   └── index.html
│   ├── package.json
│   └── README.md
├── backend
│   ├── app.py
│   ├── email_code.py
│   ├── requirements.txt
│   └── static
│       └── images
├── README.md
└── .gitignore
```

## Features

- **User Login**: Users can log in using their email address.
- **OTP Verification**: After logging in, users receive an OTP via email for verification.
- **Image Authentication**: Users must select specific images as part of the authentication process.
- **Dashboard**: A user dashboard is displayed after successful authentication.

## Technologies Used

- **Frontend**: React
- **Backend**: Flask
- **Email Service**: Flask-Mail for sending OTPs

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd multifactor-authentication
   ```

2. Set up the backend:
   - Navigate to the `backend` directory.
   - Install the required Python packages:
     ```
     pip install -r requirements.txt
     ```

3. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install the required npm packages:
     ```
     npm install
     ```

### Running the Application

1. Start the Flask backend:
   ```
   python app.py
   ```

2. Start the React frontend:
   ```
   npm start
   ```

The application will be accessible at `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.