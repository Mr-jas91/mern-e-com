import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';

const PublicRoute = ({ element, restricted, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && restricted ? <Navigate to="/" /> : element;
};

export default PublicRoute;
