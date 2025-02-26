import React from 'react';
import { Container, Paper, Typography, Box, Grid } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Dashboard = () => {
    return (
        <Container maxWidth={false} sx={{ 
            minHeight: '100vh',
            widht: "206vh",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
            animation: 'gradientBG 15s ease infinite',
            py: 4
        }}>
            <Grid container spacing={3} sx={{ maxWidth: '1200px' }}>
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'rgba(44, 62, 80, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}>
                        <SecurityIcon sx={{ 
                            fontSize: 60, 
                            color: '#f1c40f',
                            animation: 'pulse 2s infinite'
                        }} />
                        <Typography variant="h4" sx={{ 
                            color: '#ecf0f1',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            mt: 2
                        }}>
                            Security Dashboard
                        </Typography>
                    </Paper>
                </Grid>

                {/* Achievement Cards */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(44, 62, 80, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                        }
                    }}>
                        <LockIcon sx={{ fontSize: 40, color: '#2ecc71' }} />
                        <Typography variant="h6" sx={{ color: '#ecf0f1', mt: 2 }}>
                            Level 1 Complete
                        </Typography>
                        <Typography sx={{ color: '#bdc3c7' }}>
                            Email verification achieved
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(44, 62, 80, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                        }
                    }}>
                        <VpnKeyIcon sx={{ fontSize: 40, color: '#3498db' }} />
                        <Typography variant="h6" sx={{ color: '#ecf0f1', mt: 2 }}>
                            Level 2 Complete
                        </Typography>
                        <Typography sx={{ color: '#bdc3c7' }}>
                            OTP challenge conquered
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(44, 62, 80, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                        }
                    }}>
                        <SecurityIcon sx={{ fontSize: 40, color: '#e74c3c' }} />
                        <Typography variant="h6" sx={{ color: '#ecf0f1', mt: 2 }}>
                            Final Level
                        </Typography>
                        <Typography sx={{ color: '#bdc3c7' }}>
                            Access granted successfully
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;