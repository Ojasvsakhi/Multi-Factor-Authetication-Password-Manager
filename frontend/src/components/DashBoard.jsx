import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const Dashboard = () => {
    return (
         <Container
              maxWidth={false} // Allow full width
              sx={{
                height: "100vh",
                width: "200vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
              }}
            >   
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to Dashboard
                    </Typography>
                    <Typography variant="body1">
                        You have successfully authenticated!
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;