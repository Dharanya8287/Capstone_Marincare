"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const withAuth = (WrappedComponent) => {
    const AuthHOC = (props) => {
        const router = useRouter();
        const { isAuthenticated, loading } = useAuthContext();

        useEffect(() => {
            if (!loading && !isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, loading, router]);

        if (loading || !isAuthenticated) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        return <WrappedComponent {...props} />;
    };

    return AuthHOC;
};

export default withAuth;