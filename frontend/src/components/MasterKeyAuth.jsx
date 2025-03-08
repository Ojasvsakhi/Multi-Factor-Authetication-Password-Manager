import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const MasterKeyAuth = () => {
    const [masterKey, setMasterKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/verify-master-key`,
                { masterKey },
                { withCredentials: true }
            );
            setMessage(response.data.message);
            navigate('/login'); // Navigate to email login after master key verification
        } catch (error) {
            setMessage(error.response?.data?.error || 'Invalid master key');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth={false} sx={{ 
            minHeight: '100vh',
            width: "206vh",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
            animation: 'gradientBG 15s ease infinite',
        }}>
            <Paper elevation={3} sx={{
                p: 4,
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(44, 62, 80, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '15px',
            }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <VpnKeyIcon sx={{ 
                        fontSize: 50, 
                        color: '#f1c40f',
                        animation: 'pulse 2s infinite'
                    }} />
                    <Typography variant="h4" sx={{ 
                        color: '#ecf0f1',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        mt: 2
                    }}>
                        Level 1: Master Key
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#bdc3c7', mt: 1 }}>
                        Enter the master key to begin your quest
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        type="password"
                        value={masterKey}
                        onChange={(e) => setMasterKey(e.target.value)}
                        label="Enter Master Key"
                        variant="outlined"
                        margin="normal"
                        required
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#ecf0f1',
                                '& fieldset': {
                                    borderColor: '#3498db',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#2ecc71',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#bdc3c7',
                            }
                        }}
                    />
                    <Button 
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            mb: 2,
                            background: 'linear-gradient(45deg, #2ecc71, #3498db)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 5px 15px rgba(46, 204, 113, 0.4)',
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Unlock Access'}
                    </Button>
                    {message && (
                        <Alert 
                            severity={message.includes('successfully') ? 'success' : 'error'}
                            sx={{ mt: 2 }}
                        >
                            {message}
                        </Alert>
                    )}
                </form>
            </Paper>
        </Container>
    );
};

export default MasterKeyAuth;