import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorBoundary from './ErrorBoundary'

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
  
    if (loading) {
      return <div className="loading-spinner">Authenticating...<CircularProgress sx={{ color: '#033043'}} size={30} /></div>;
    }
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    // if (roles && !roles.includes(user.role)) {
    //   return <Navigate to="/unauthorized" replace />;
    // }
  
    return <ErrorBoundary>{children}</ErrorBoundary>;
  };

export default ProtectedRoute;