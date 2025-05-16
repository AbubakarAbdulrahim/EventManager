import { useState } from 'react';
import NavAppBar from '../../components/vendor/NavAppBar';
import { Box } from '@mui/material';
import Services from './Services';
import Customers from './Customers';
import {useAuth} from '../../context/AuthContext'
import Income from './Income';
import Settings from './Settings';
import Dashboard from './Dashboard';
export default function VendorDashboard() {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const { user } = useAuth();

    console.log(user)
    const renderContent = () => {
        switch (currentPage.toLocaleLowerCase()) {
            case 'dashboard':
                return <Dashboard />;
            case 'services':
                return <Services />;
            case 'customers':
                return <Customers />;
            case 'income':
                return <Income />;
            case 'settings':
                return <Settings />;
            default:
                return 'dashboard';
        }
    };
    return (
        <> 
        <NavAppBar setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <Box sx={{ pl: 9, pt: 9, bgcolor: '#f5f5f5', height: '100%' }}>
            {renderContent()}
        </Box>
        </>
    )
};
