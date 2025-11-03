// frontend/src/components/ErrorBoundary.jsx
// FIX #5: Error boundary for authentication errors

"use client";
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        padding: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                        Something went wrong
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: '#64748b' }}>
                        We're sorry for the inconvenience. Please try refreshing the page.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.href = '/'}
                        sx={{
                            backgroundColor: '#0891b2',
                            '&:hover': { backgroundColor: '#0e7490' },
                        }}
                    >
                        Go to Home
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;