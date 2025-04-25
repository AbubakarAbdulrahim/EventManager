import { Box } from '@mui/material'
import NavAppBar from '../../components/admin/NavAppBar'
import VendorApplicationAdminPage from './VendorApplicationAdminPage'
import { useState } from 'react';

export default function Admin(params) {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const renderContent = () => {
    switch (currentPage.toLocaleLowerCase()) {
      // case 'dashboard':
      //   return <DashboardContent />;
      // case 'users':
      //   return <CustomersContent />;
      case 'vendors':
        return <VendorApplicationAdminPage />;
      // case 'bookings':
      //   return <BookingsContent />;
      // case 'payments':
      //   return <PaymentsContent />;
      // case 'reports':
      //   return <ReportsContent />;
      // case 'support':
      //   return <SupportContent />;
      // case 'settings':
      //   return <SettingsContent />;
      default:
        return 'dashboard';
    }
  };
  return(
    <>
    {/* <Box sx={{position:'relative'}}> */}

    <NavAppBar setCurrentPage={setCurrentPage} currentPage={currentPage} />
    <Box sx={{pl:9, pt:9}}>
      {/* <VendorApplicationAdminPage/> */}
      {renderContent()}
      
    </Box>
    {/* </Box> */}
    </>
  )
};
