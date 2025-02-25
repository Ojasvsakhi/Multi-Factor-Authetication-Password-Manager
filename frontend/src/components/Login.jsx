import React, { useState } from 'react';
import { 
    Button, 
    TextField, 
    Container, 
    Paper, 
    Typography,
    Box
} from '@mui/material';
import axios from 'axios';
import API_URL from "../config";  // Import API URL

const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`${API_URL}/send_otp`, { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            required
                            disabled={loading}
                        />
                        <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </Button>
                        {message && (
                            <Typography 
                                color={message.includes('error') ? 'error' : 'success'} 
                                sx={{ mt: 2 }} 
                                align="center"
                            >
                                {message}
                            </Typography>
                        )}
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
