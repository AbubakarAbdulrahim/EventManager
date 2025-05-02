import { Box } from '@mui/material'
import NavAppBar from '../../components/admin/NavAppBar'
import VendorApplicationAdminPage from './VendorApplicationAdminPage'
import { useState } from 'react';
import {useAuth} from '../../context/AuthContext'
import Customers from './Customers';
import Dashboard from './Dashboard';
import Bookings from './Bookings';
import Services from './Services';
import Payments from './Payments';
import Reports from './Reports';
import Support from './Support';
import Settings from './Settings';

export default function Admin(params) {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const { user } = useAuth();
  console.log(user.role)
  
  const renderContent = () => {
    switch (currentPage.toLocaleLowerCase()) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'customers':
        return <Customers />;
      case 'vendors':
        return <VendorApplicationAdminPage />;
      case 'bookings':
        return <Bookings/>;
      case 'services':
        return <Services/>;
      case 'payments':
        return <Payments />;
      case 'reports':
        return <Reports />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      default:
        return 'dashboard';
    }
  };
  return(
    <>
    {/* <Box sx={{position:'relative'}}> */}

    <NavAppBar setCurrentPage={setCurrentPage} currentPage={currentPage} />
    <Box sx={{pl:9, pt:9, bgcolor:'#f5f5f5', height:'100%'}}>

      {renderContent()}
      
    </Box>
    {/* </Box> */}
    </>
  )
};
