import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
    const token = localStorage.getItem('token');

    if (token) {
        // Already logged in → redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
}
