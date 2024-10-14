import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext'; 
const PrivateRoute = ({ element, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
