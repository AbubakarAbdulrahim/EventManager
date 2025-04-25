import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  Container, 
  Grid, 
  Paper, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Badge, 
  Menu, 
  MenuItem, 
  ThemeProvider, 
  createTheme,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Avatar,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  BarChart as BarChartIcon,
  EventNote as EventNoteIcon,
  Store as StoreIcon,
  SupportAgent as SupportAgentIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  LocalOffer as LocalOfferIcon,
  Email as EmailIcon,
  Stars as StarsIcon,
  CalendarToday as CalendarTodayIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';

// Chart components
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';

// Sample data for demonstration
// const revenueData = [
//   { month: 'Jan', revenue: 4000, bookings: 24 },
//   { month: 'Feb', revenue: 3000, bookings: 18 },
//   { month: 'Mar', revenue: 5000, bookings: 29 },
//   { month: 'Apr', revenue: 7000, bookings: 35 },
//   { month: 'May', revenue: 6000, bookings: 32 },
//   { month: 'Jun', revenue: 8000, bookings: 42 },
// ];

const bookingStatusData = [
  { name: 'Completed', value: 87 },
  { name: 'Cancelled', value: 13 },
];

// const bookingTypeData = [
//   { name: 'Photography', value: 35 },
//   { name: 'Catering', value: 25 },
//   { name: 'Venues', value: 20 },
//   { name: 'Entertainment', value: 15 },
//   { name: 'Other', value: 5 },
// ];

const recentBookings = [
  { id: 'BK001', customer: 'John Doe', service: 'Photography', vendor: 'ProShots Inc.', date: '2025-04-22', amount: 1200, status: 'Completed' },
  { id: 'BK002', customer: 'Jane Smith', service: 'Catering', vendor: 'Delicious Foods', date: '2025-04-23', amount: 2500, status: 'Upcoming' },
  { id: 'BK003', customer: 'Mike Johnson', service: 'Venue', vendor: 'Grand Ballroom', date: '2025-04-25', amount: 5000, status: 'Pending' },
  { id: 'BK004', customer: 'Sarah Williams', service: 'DJ Services', vendor: 'Beat Masters', date: '2025-04-20', amount: 800, status: 'Completed' },
  { id: 'BK005', customer: 'Robert Brown', service: 'Decor', vendor: 'Elegant Designs', date: '2025-04-24', amount: 1500, status: 'Cancelled' },
];

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-123-4567', bookings: 5, joinDate: '2024-01-15', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543', bookings: 3, joinDate: '2024-02-10', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-555-5555', bookings: 2, joinDate: '2024-03-05', status: 'Active' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '555-444-3333', bookings: 7, joinDate: '2023-11-20', status: 'Active' },
  { id: 5, name: 'Robert Brown', email: 'robert@example.com', phone: '555-222-1111', bookings: 0, joinDate: '2024-04-02', status: 'Suspended' },
];

const vendors = [
  { id: 1, name: 'ProShots Inc.', category: 'Photography', services: 4, rating: 4.8, earnings: 12500, status: 'Verified' },
  { id: 2, name: 'Delicious Foods', category: 'Catering', services: 6, rating: 4.5, earnings: 25000, status: 'Verified' },
  { id: 3, name: 'Grand Ballroom', category: 'Venues', services: 2, rating: 4.9, earnings: 50000, status: 'Verified' },
  { id: 4, name: 'Beat Masters', category: 'Entertainment', services: 3, rating: 4.2, earnings: 8000, status: 'Verified' },
  { id: 5, name: 'Elegant Designs', category: 'Decor', services: 5, rating: 4.7, earnings: 15000, status: 'Pending' },
];

const services = [
  { id: 1, name: 'Wedding Photography', vendor: 'ProShots Inc.', price: 1200, bookings: 28, rating: 4.8, status: 'Active' },
  { id: 2, name: 'Corporate Event Catering', vendor: 'Delicious Foods', price: 2500, bookings: 15, rating: 4.6, status: 'Active' },
  { id: 3, name: 'Grand Hall Rental', vendor: 'Grand Ballroom', price: 5000, bookings: 10, rating: 4.9, status: 'Active' },
  { id: 4, name: 'DJ Services', vendor: 'Beat Masters', price: 800, bookings: 22, rating: 4.3, status: 'Active' },
  { id: 5, name: 'Wedding Decor Package', vendor: 'Elegant Designs', price: 1500, bookings: 18, rating: 4.7, status: 'Pending Approval' },
];

const transactions = [
  { id: 'TR001', booking: 'BK001', customer: 'John Doe', vendor: 'ProShots Inc.', amount: 1200, fee: 60, vendorAmount: 1140, date: '2025-04-22', status: 'Completed' },
  { id: 'TR002', booking: 'BK002', customer: 'Jane Smith', vendor: 'Delicious Foods', amount: 2500, fee: 125, vendorAmount: 2375, date: '2025-04-23', status: 'Pending' },
  { id: 'TR003', booking: 'BK003', customer: 'Mike Johnson', vendor: 'Grand Ballroom', amount: 5000, fee: 250, vendorAmount: 4750, date: '2025-04-25', status: 'Pending' },
  { id: 'TR004', booking: 'BK004', customer: 'Sarah Williams', vendor: 'Beat Masters', amount: 800, fee: 40, vendorAmount: 760, date: '2025-04-20', status: 'Completed' },
  { id: 'TR005', booking: 'BK005', customer: 'Robert Brown', vendor: 'Elegant Designs', amount: 1500, fee: 75, vendorAmount: 0, date: '2025-04-24', status: 'Refunded' },
];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#033043'];

const theme = createTheme({
  palette: {
    primary: {
      main: '#033043',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const drawerWidth = 240;

export default function AdminDashboard() {
  const [open, setOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Customers':
        return <CustomersContent />;
      case 'Vendors':
        return <VendorsContent />;
      case 'Bookings':
        return <BookingsContent />;
      case 'Services':
        return <ServicesContent />;
      case 'Payments':
        return <PaymentsContent />;
      case 'Reports':
        return <ReportsContent />;
      case 'Support':
        return <SupportContent />;
      case 'Settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            ...(open && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: (theme) =>
                theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            }),
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {currentPage} - Booking Management Admin
            </Typography>
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">New booking request from Jane Smith</Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">Vendor approval pending for Elegant Designs</Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">Customer support ticket #1234 requires attention</Typography>
              </MenuItem>
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2">System update scheduled for tomorrow</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleNotificationsClose}>
                <Typography variant="body2" color="primary">View all notifications</Typography>
              </MenuItem>
            </Menu>
            <IconButton color="inherit" onClick={handleAccountClick}>
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={accountAnchorEl}
              open={Boolean(accountAnchorEl)}
              onClose={handleAccountClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleAccountClose}>
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleAccountClose}>
                <Typography variant="body2">Account Settings</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleAccountClose}>
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              ...(open
                ? {}
                : {
                    overflowX: 'hidden',
                    transition: (theme) =>
                      theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                      }),
                    width: (theme) => theme.spacing(7),
                    [theme.breakpoints.up('sm')]: {
                      width: (theme) => theme.spacing(9),
                    },
                  }),
            },
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
              Admin Panel
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button onClick={() => handlePageChange('Dashboard')} selected={currentPage === 'Dashboard'}>
              <ListItemIcon>
                <DashboardIcon color={currentPage === 'Dashboard' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Customers')} selected={currentPage === 'Customers'}>
              <ListItemIcon>
                <PersonIcon color={currentPage === 'Customers' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Vendors')} selected={currentPage === 'Vendors'}>
              <ListItemIcon>
                <PeopleIcon color={currentPage === 'Vendors' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Vendors" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Bookings')} selected={currentPage === 'Bookings'}>
              <ListItemIcon>
                <EventNoteIcon color={currentPage === 'Bookings' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Bookings" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Services')} selected={currentPage === 'Services'}>
              <ListItemIcon>
                <StoreIcon color={currentPage === 'Services' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Services" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Payments')} selected={currentPage === 'Payments'}>
              <ListItemIcon>
                <PaymentIcon color={currentPage === 'Payments' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Payments" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Reports')} selected={currentPage === 'Reports'}>
              <ListItemIcon>
                <BarChartIcon color={currentPage === 'Reports' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Support')} selected={currentPage === 'Support'}>
              <ListItemIcon>
                <SupportAgentIcon color={currentPage === 'Support' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItem>
            <ListItem button onClick={() => handlePageChange('Settings')} selected={currentPage === 'Settings'}>
              <ListItemIcon>
                <SettingsIcon color={currentPage === 'Settings' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {renderPage()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Dashboard overview page
function DashboardContent() {
  return (
    <Grid container spacing={3}>
      {/* Key metrics */}
      <Grid item xs={12} md={3}>
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Bookings
          </Typography>
          <Typography component="p" variant="h4">
            124
          </Typography>
          <Typography variant="body2" sx={{ flex: 1 }}>
            15% increase from last month
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Revenue
          </Typography>
          <Typography component="p" variant="h4">
            $45,756
          </Typography>
          <Typography variant="body2" sx={{ flex: 1 }}>
            23% increase from last month
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Active Customers
          </Typography>
          <Typography component="p" variant="h4">
            85
          </Typography>
          <Typography variant="body2" sx={{ flex: 1 }}>
            8 new this week
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Active Vendors
          </Typography>
          <Typography component="p" variant="h4">
            32
          </Typography>
          <Typography variant="body2" sx={{ flex: 1 }}>
            5 pending approvals
          </Typography>
        </Paper>
      </Grid>
      
      {/* Charts */}
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Revenue & Bookings
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#033043" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#033043" activeDot={{ r: 8 }} name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#82ca9d" name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Booking Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                width={'100%'}
                labelLine={false}
                outerRadius={80}
                fill="#033043"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      
      {/* Recent bookings */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Recent Bookings
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button startIcon={<RefreshIcon />} size="small">
              Refresh
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.customer}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.vendor}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell align="right">${booking.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={
                          booking.status === 'Completed' ? 'success' : 
                          booking.status === 'Upcoming' ? 'primary' :
                          booking.status === 'Pending' ? 'warning' : 'error'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button color="primary">View All Bookings</Button>
          </Box>
        </Paper>
      </Grid>
      
      {/* System alerts */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            System Alerts & Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="5 vendor applications require review" 
                secondary="Last application received 2 hours ago" 
              />
              <Button size="small" variant="contained">Review</Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Badge color="warning" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="3 customer support tickets awaiting response" 
                secondary="Oldest ticket was created 5 hours ago" 
              />
              <Button size="small" variant="contained">View</Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Badge color="info" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="System maintenance scheduled" 
                secondary="Scheduled for April 25, 2025 at 02:00 AM" 
              />
              <Button size="small" variant="outlined">Details</Button>
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Customers management page
function CustomersContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography component="h2" variant="h6" color="primary">
              Customer Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Add Customer
              </Button>
              <TextField
                size="small"
                placeholder="Search customers..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="center">Bookings</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell align="center">{customer.bookings}</TableCell>
                    <TableCell>{customer.joinDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={customer.status} 
                        color={customer.status === 'Active' ? 'success' : 'error'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button size="small" variant="outlined">View</Button>
                        <Button size="small" variant="outlined" color="secondary">
                          {customer.status === 'Active' ? 'Suspend' : 'Activate'}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Vendors management page
function VendorsContent() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="vendor management tabs">
              <Tab label="All Vendors" />
              <Tab label="Pending Approval" />
              <Tab label="Add New Vendor" />
            </Tabs>
          </Box>
          
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Vendor List
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search vendors..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Services</TableCell>
                      <TableCell align="center">Rating</TableCell>
                      <TableCell align="right">Total Earnings</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>{vendor.id}</TableCell>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.category}</TableCell>
                        <TableCell align="center">{vendor.services}</TableCell>
                        <TableCell align="center">{vendor.rating}</TableCell>
                        <TableCell align="right">${vendor.earnings}</TableCell>
                        <TableCell>
                          <Chip 
                            label={vendor.status} 
                            color={vendor.status === 'Verified' ? 'success' : 'warning'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            {vendor.status === 'Pending' ? (
                              <>
                                <Button size="small" variant="outlined" color="success">Approve</Button>
                                <Button size="small" variant="outlined" color="error">Reject</Button>
                              </>
                            ) : (
                              <Button size="small" variant="outlined" color="secondary">Suspend</Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 1 && (
            <>
              <Typography variant="h6" sx={{ my: 2 }}>Pending Vendor Approvals</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Application Date</TableCell>
                      <TableCell>Services Offered</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Elegant Designs</TableCell>
                      <TableCell>Decor</TableCell>
                      <TableCell>2025-04-18</TableCell>
                      <TableCell>Wedding Decor, Corporate Event Design</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">Review</Button>
                          <Button size="small" variant="outlined" color="success">Approve</Button>
                          <Button size="small" variant="outlined" color="error">Reject</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sweet Treats</TableCell>
                      <TableCell>Catering</TableCell>
                      <TableCell>2025-04-20</TableCell>
                      <TableCell>Dessert Catering, Wedding Cakes</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">Review</Button>
                          <Button size="small" variant="outlined" color="success">Approve</Button>
                          <Button size="small" variant="outlined" color="error">Reject</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Add New Vendor</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Business Name" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Contact Person" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email" variant="outlined" type="email" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Phone" variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Business Category</InputLabel>
                    <Select label="Business Category">
                      <MenuItem value="Photography">Photography</MenuItem>
                      <MenuItem value="Catering">Catering</MenuItem>
                      <MenuItem value="Venues">Venues</MenuItem>
                      <MenuItem value="Entertainment">Entertainment</MenuItem>
                      <MenuItem value="Decor">Decor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Years in Business" variant="outlined" type="number" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Description"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Services Offered</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Service Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField fullWidth label="Price" variant="outlined" type="number" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ height: '100%' }}
                      >
                        Add Service
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="contained">Create Vendor</Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

// Bookings management page
function BookingsContent() {
  const [statusFilter, setStatusFilter] = useState('All');
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h2" variant="h6" color="primary">
              Booking Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Bookings</MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create Booking
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              label="Search"
              size="small"
              placeholder="Search by ID, customer, or vendor"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <TextField
              label="From Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Service Type</InputLabel>
              <Select label="Service Type">
                <MenuItem value="All">All Services</MenuItem>
                <MenuItem value="Photography">Photography</MenuItem>
                <MenuItem value="Catering">Catering</MenuItem>
                <MenuItem value="Venue">Venue</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.customer}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.vendor}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell align="right">${booking.amount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={
                          booking.status === 'Completed' ? 'success' : 
                          booking.status === 'Upcoming' ? 'primary' :
                          booking.status === 'Pending' ? 'warning' : 'error'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button size="small" variant="outlined">View</Button>
                        {booking.status === 'Upcoming' && (
                          <Button size="small" variant="outlined" color="error">Cancel</Button>
                        )}
                        {booking.status === 'Completed' && (
                          <Button size="small" variant="outlined" color="secondary">Invoice</Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Services management page
function ServicesContent() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h2" variant="h6" color="primary">
              Service Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Photography">Photography</MenuItem>
                  <MenuItem value="Catering">Catering</MenuItem>
                  <MenuItem value="Venues">Venues</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Decor">Decor</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search services..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Bookings</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.vendor}</TableCell>
                    <TableCell align="right">${service.price}</TableCell>
                    <TableCell align="center">{service.bookings}</TableCell>
                    <TableCell align="center">{service.rating}</TableCell>
                    <TableCell>
                      <Chip 
                        label={service.status} 
                        color={service.status === 'Active' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button size="small" variant="outlined">View</Button>
                        {service.status === 'Pending Approval' ? (
                          <>
                            <Button size="small" variant="outlined" color="success">Approve</Button>
                            <Button size="small" variant="outlined" color="error">Reject</Button>
                          </>
                        ) : (
                          <Button size="small" variant="outlined" color="secondary">
                            {service.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Service Categories
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField 
                  label="New Category" 
                  size="small" 
                  fullWidth 
                  sx={{ mr: 2 }}
                />
                <Button variant="contained">Add</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category Name</TableCell>
                      <TableCell align="center">Services</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Photography</TableCell>
                      <TableCell align="center">24</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Catering</TableCell>
                      <TableCell align="center">18</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Venues</TableCell>
                      <TableCell align="center">15</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Entertainment</TableCell>
                      <TableCell align="center">12</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Decor</TableCell>
                      <TableCell align="center">10</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControl size="small" fullWidth sx={{ mr: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category">
                    <MenuItem value="Photography">Photography</MenuItem>
                    <MenuItem value="Catering">Catering</MenuItem>
                    <MenuItem value="Venues">Venues</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Decor">Decor</MenuItem>
                  </Select>
                </FormControl>
                <TextField 
                  label="New Subcategory" 
                  size="small" 
                  fullWidth 
                  sx={{ mr: 2 }}
                />
                <Button variant="contained">Add</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Subcategory</TableCell>
                      <TableCell align="center">Services</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Photography</TableCell>
                      <TableCell>Wedding</TableCell>
                      <TableCell align="center">12</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Photography</TableCell>
                      <TableCell>Portrait</TableCell>
                      <TableCell align="center">8</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Catering</TableCell>
                      <TableCell>Full Service</TableCell>
                      <TableCell align="center">10</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Catering</TableCell>
                      <TableCell>Buffet</TableCell>
                      <TableCell align="center">5</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Venues</TableCell>
                      <TableCell>Indoor</TableCell>
                      <TableCell align="center">8</TableCell>
                      <TableCell align="center">
                        <Button size="small">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Payments management page
function PaymentsContent() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment management tabs">
              <Tab label="Transactions" />
              <Tab label="Vendor Payouts" />
              <Tab label="Refunds" />
              <Tab label="Settings" />
            </Tabs>
          </Box>
          
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Transaction History
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="From Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="To Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" startIcon={<RefreshIcon />}>
                    Filter
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Booking</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Fee</TableCell>
                      <TableCell align="right">Vendor Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.booking}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.vendor}</TableCell>
                        <TableCell align="right">${transaction.amount}</TableCell>
                        <TableCell align="right">${transaction.fee}</TableCell>
                        <TableCell align="right">${transaction.vendorAmount}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.status} 
                            color={
                              transaction.status === 'Completed' ? 'success' : 
                              transaction.status === 'Pending' ? 'warning' : 'error'
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Vendor Payouts
                </Typography>
                <Button variant="contained" startIcon={<AttachMoneyIcon />}>
                  Process Payouts
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell align="right">Pending Amount</TableCell>
                      <TableCell>Last Payout</TableCell>
                      <TableCell>Payout Method</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>ProShots Inc.</TableCell>
                      <TableCell align="right">$3,420</TableCell>
                      <TableCell>2025-04-10</TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined">Process</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Delicious Foods</TableCell>
                      <TableCell align="right">$7,125</TableCell>
                      <TableCell>2025-04-05</TableCell>
                      <TableCell>PayPal</TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined">Process</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Grand Ballroom</TableCell>
                      <TableCell align="right">$14,250</TableCell>
                      <TableCell>2025-03-28</TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined">Process</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Beat Masters</TableCell>
                      <TableCell align="right">$2,280</TableCell>
                      <TableCell>2025-04-12</TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell align="center">
                      <Button size="small" variant="outlined">Process</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 2 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Refund Management
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search refunds..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Request Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>BK005</TableCell>
                      <TableCell>Robert Brown</TableCell>
                      <TableCell>Wedding Decor Package</TableCell>
                      <TableCell>2025-04-24</TableCell>
                      <TableCell align="right">$1,500</TableCell>
                      <TableCell>Cancellation</TableCell>
                      <TableCell>
                        <Chip label="Completed" color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>BK008</TableCell>
                      <TableCell>Lisa Miller</TableCell>
                      <TableCell>DJ Services</TableCell>
                      <TableCell>2025-04-22</TableCell>
                      <TableCell align="right">$800</TableCell>
                      <TableCell>Service issue</TableCell>
                      <TableCell>
                        <Chip label="Pending" color="warning" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">View</Button>
                          <Button size="small" variant="outlined" color="success">Approve</Button>
                          <Button size="small" variant="outlined" color="error">Reject</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 3 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Payment & Commission Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Platform Commission Rates</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            label="Platform Commission Rate (%)"
                            type="number"
                            defaultValue="5"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>Category-Specific Rates</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField fullWidth label="Photography" defaultValue="5" InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }} />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField fullWidth label="Catering" defaultValue="4" InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }} />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField fullWidth label="Venues" defaultValue="3" InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }} />
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button variant="contained">Save Changes</Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Payout Settings</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Default Payout Schedule</InputLabel>
                          <Select defaultValue="biweekly" label="Default Payout Schedule">
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="biweekly">Bi-weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <TextField
                            label="Minimum Payout Amount"
                            type="number"
                            defaultValue="100"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Enable automatic payouts"
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button variant="contained">Save Changes</Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

// Reports and analytics page
function ReportsContent() {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h2" variant="h6" color="primary">
              Revenue & Booking Reports
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={reportPeriod}
                  label="Time Period"
                  onChange={(e) => setReportPeriod(e.target.value)}
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<RefreshIcon />}>
                Generate Report
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" gutterBottom>Revenue Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#033043" name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Booking Types</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#033043"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Booking Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#82ca9d" name="Number of Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Growth Metrics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Customer Growth</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { month: 'Jan', customers: 45 },
                  { month: 'Feb', customers: 52 },
                  { month: 'Mar', customers: 61 },
                  { month: 'Apr', customers: 68 },
                  { month: 'May', customers: 75 },
                  { month: 'Jun', customers: 85 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#033043" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Vendor Growth</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { month: 'Jan', vendors: 18 },
                  { month: 'Feb', vendors: 21 },
                  { month: 'Mar', vendors: 24 },
                  { month: 'Apr', vendors: 26 },
                  { month: 'May', vendors: 29 },
                  { month: 'Jun', vendors: 32 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendors" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Advanced Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardHeader title="Customer Behavior" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Time Between Bookings
                  </Typography>
                  <Typography variant="h6">45 days</Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                    Repeat Booking Rate
                  </Typography>
                  <Typography variant="h6">38%</Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                    Average Spend per Customer
                  </Typography>
                  <Typography variant="h6">$2,458</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardHeader title="Vendor Performance" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Top Performing Vendor Category
                  </Typography>
                  <Typography variant="h6">Photography (32% of Revenue)</Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                    Average Vendor Rating
                  </Typography>
                  <Typography variant="h6">4.7/5.0</Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                    Vendor Retention Rate
                  </Typography>
                  <Typography variant="h6">92%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardHeader title="Peak Booking Analysis" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Peak Booking Day
                  </Typography>
                  <Typography variant="h6">Saturday (42% of Bookings)</Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                    Peak Booking Time
                  </Typography>
                  <Typography variant="h6">7:00 PM - 9:00 PM</Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                    Peak Booking Month
                  </Typography>
                  <Typography variant="h6">June (18% of Annual Bookings)</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

// Support & Dispute management page
function SupportContent() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="support management tabs">
              <Tab label="Support Tickets" />
              <Tab label="Disputes" />
              <Tab label="Chat Logs" />
            </Tabs>
          </Box>
          
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Customer Support Tickets
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select defaultValue="open" label="Status">
                      <MenuItem value="all">All Tickets</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="inprogress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    placeholder="Search tickets..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>TKT1234</TableCell>
                      <TableCell>Refund request for booking</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>2025-04-20</TableCell>
                      <TableCell>2025-04-21</TableCell>
                      <TableCell>
                        <Chip label="High" color="error" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="Open" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">View</Button>
                          <Button size="small" variant="outlined" color="success">Respond</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TKT1235</TableCell>
                      <TableCell>Vendor not responding</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>2025-04-19</TableCell>
                      <TableCell>2025-04-22</TableCell>
                      <TableCell>
                        <Chip label="Medium" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="In Progress" color="primary" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">View</Button>
                          <Button size="small" variant="outlined" color="success">Respond</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TKT1236</TableCell>
                      <TableCell>Account verification issue</TableCell>
                      <TableCell>Mike Johnson</TableCell>
                      <TableCell>2025-04-18</TableCell>
                      <TableCell>2025-04-21</TableCell>
                      <TableCell>
                        <Chip label="Low" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label="Resolved" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Dispute Management
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select defaultValue="open" label="Status">
                    <MenuItem value="all">All Disputes</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="inprogress">In Mediation</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Dispute ID</TableCell>
                      <TableCell>Booking</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Filed On</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>DIS001</TableCell>
                      <TableCell>BK008</TableCell>
                      <TableCell>Lisa Miller</TableCell>
                      <TableCell>Beat Masters</TableCell>
                      <TableCell>2025-04-22</TableCell>
                      <TableCell>Service quality issue</TableCell>
                      <TableCell>
                        <Chip label="Open" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">View</Button>
                          <Button size="small" variant="outlined" color="primary">Mediate</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DIS002</TableCell>
                      <TableCell>BK012</TableCell>
                      <TableCell>Tom Wilson</TableCell>
                      <TableCell>Delicious Foods</TableCell>
                      <TableCell>2025-04-18</TableCell>
                      <TableCell>Late delivery</TableCell>
                      <TableCell>
                        <Chip label="In Mediation" color="primary" size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">View</Button>
                          <Button size="small" variant="outlined" color="success">Resolve</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DIS003</TableCell>
                      <TableCell>BK010</TableCell>
                      <TableCell>Sarah Williams</TableCell>
                      <TableCell>ProShots Inc.</TableCell>
                      <TableCell>2025-04-15</TableCell>
                      <TableCell>Photo quality issue</TableCell>
                      <TableCell>
                        <Chip label="Resolved" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {tabValue === 2 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Customer/Vendor Communication Logs
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="From Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="To Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" startIcon={<SearchIcon />}>
                    Search
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Conversation ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Related Booking</TableCell>
                      <TableCell>Started</TableCell>
                      <TableCell>Last Message</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>CONV124</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>ProShots Inc.</TableCell>
                      <TableCell>BK001</TableCell>
                      <TableCell>2025-04-15</TableCell>
                      <TableCell>2025-04-22</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">View Chat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CONV125</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Delicious Foods</TableCell>
                      <TableCell>BK002</TableCell>
                      <TableCell>2025-04-18</TableCell>
                      <TableCell>2025-04-23</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">View Chat</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CONV126</TableCell>
                      <TableCell>Mike Johnson</TableCell>
                      <TableCell>Grand Ballroom</TableCell>
                      <TableCell>BK003</TableCell>
                      <TableCell>2025-04-20</TableCell>
                      <TableCell>2025-04-22</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">View Chat</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

// Settings page
function SettingsContent() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs">
              <Tab label="Booking Policies" />
              <Tab label="Notification Templates" />
              <Tab label="System Settings" />
            </Tabs>
          </Box>
          
          {currentTab === 0 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" gutterBottom>Booking Policies</Typography>
              
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Cancellation Policy</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Cancellation Policy Text"
                      defaultValue="Customers may cancel their booking up to 48 hours before the scheduled service time and receive a full refund. Cancellations made between 48 and 24 hours before the scheduled service time will receive a 50% refund. Cancellations made less than 24 hours before the scheduled service time will not be refunded."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Full Refund Threshold (hours)"
                      type="number"
                      defaultValue="48"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Partial Refund Threshold (hours)"
                      type="number"
                      defaultValue="24"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Partial Refund Percentage"
                      type="number"
                      defaultValue="50"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
              
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Refund Policy</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Refund Policy Text"
                      defaultValue="Refunds will be processed within 7 business days after approval. All refunds will be issued to the original payment method. Disputes must be filed within 48 hours of service completion."
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Refund Processing Time (days)"
                      type="number"
                      defaultValue="7"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Dispute Filing Window (hours)"
                      type="number"
                      defaultValue="48"
                    />
                  </Grid>
                </Grid>
              </Card>
              
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Booking Policy</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Booking Policy Text"
                      defaultValue="Bookings must be made at least 24 hours in advance. Vendors have the right to accept or decline bookings based on availability. Payment is required at the time of booking to confirm reservation."
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Advance Booking Time (hours)"
                      type="number"
                      defaultValue="24"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Booking Confirmation Method</InputLabel>
                      <Select defaultValue="automatic" label="Booking Confirmation Method">
                        <MenuItem value="automatic">Automatic</MenuItem>
                        <MenuItem value="manual">Manual Vendor Approval</MenuItem>
                        <MenuItem value="adminReview">Admin Review</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary">
                  Save All Policy Changes
                </Button>
              </Box>
            </Box>
          )}
          
          {currentTab === 1 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" gutterBottom>Notification Templates</Typography>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Customer Booking Confirmation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Subject"
                        defaultValue="Your booking confirmation - {{booking_id}}"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Email Body"
                        defaultValue="Dear {{customer_name}},

Thank you for your booking with EventConnect! Your booking has been confirmed.

Booking Details:
- Booking ID: {{booking_id}}
- Service: {{service_name}}
- Date & Time: {{booking_date}} at {{booking_time}}
- Vendor: {{vendor_name}}
- Total Amount: {{amount}}

If you have any questions, please don't hesitate to contact us.

Best regards,
The EventConnect Team"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="SMS Template"
                        defaultValue="EventConnect: Your booking #{{booking_id}} is confirmed for {{booking_date}}. View details in your account."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Send Email Notification"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Send SMS Notification"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Send In-App Notification"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Vendor Booking Notification</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Subject"
                        defaultValue="New booking request - {{booking_id}}"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Email Body"
                        defaultValue="Dear {{vendor_name}},

You have received a new booking request.

Booking Details:
- Booking ID: {{booking_id}}
- Service: {{service_name}}
- Date & Time: {{booking_date}} at {{booking_time}}
- Customer: {{customer_name}}
- Amount: {{amount}}

Please log in to your vendor dashboard to accept or decline this booking.

Best regards,
The EventConnect Team"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="SMS Template"
                        defaultValue="EventConnect: New booking request #{{booking_id}} for {{booking_date}}. Log in to accept/decline."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Send Email Notification"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Send SMS Notification"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Send In-App Notification"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Booking Cancellation</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Subject"
                        defaultValue="Booking cancellation - {{booking_id}}"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Email Body"
                        defaultValue="Dear {{recipient_name}},

A booking has been cancelled.

Booking Details:
- Booking ID: {{booking_id}}
- Service: {{service_name}}
- Date & Time: {{booking_date}} at {{booking_time}}
- Cancellation Reason: {{cancellation_reason}}
- Refund Amount: {{refund_amount}}

For any questions, please contact our support team.

Best regards,
The EventConnect Team"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="SMS Template"
                        defaultValue="EventConnect: Booking #{{booking_id}} has been cancelled. {{refund_status}}"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Payment Reminder</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Subject"
                        defaultValue="Payment reminder for booking {{booking_id}}"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Email Body"
                        defaultValue="Dear {{customer_name}},

This is a reminder that payment for your upcoming booking is due.

Booking Details:
- Booking ID: {{booking_id}}
- Service: {{service_name}}
- Date & Time: {{booking_date}} at {{booking_time}}
- Amount Due: {{amount_due}}
- Due Date: {{due_date}}

Please log in to your account to complete the payment.

Best regards,
The EventConnect Team"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="SMS Template"
                        defaultValue="EventConnect: Payment reminder for booking #{{booking_id}}. Amount due: {{amount_due}}. Please pay by {{due_date}}."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Reminder Schedule</InputLabel>
                        <Select defaultValue="7,3,1" label="Reminder Schedule">
                          <MenuItem value="7,3,1">7 days, 3 days, and 1 day before due date</MenuItem>
                          <MenuItem value="5,2">5 days and 2 days before due date</MenuItem>
                          <MenuItem value="3,1">3 days and 1 day before due date</MenuItem>
                          <MenuItem value="custom">Custom Schedule</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary">
                  Save All Templates
                </Button>
              </Box>
            </Box>
          )}
          
          {currentTab === 2 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" gutterBottom>System Settings</Typography>
              
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>General Settings</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Platform Name"
                      defaultValue="EventConnect"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Support Email"
                      defaultValue="support@eventconnect.com"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Support Phone"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Default Language</InputLabel>
                      <Select defaultValue="en" label="Default Language">
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Default Currency</InputLabel>
                      <Select defaultValue="usd" label="Default Currency">
                        <MenuItem value="usd">USD ($)</MenuItem>
                        <MenuItem value="eur">EUR (€)</MenuItem>
                        <MenuItem value="gbp">GBP (£)</MenuItem>
                        <MenuItem value="cad">CAD ($)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Date Format</InputLabel>
                      <Select defaultValue="mdy" label="Date Format">
                        <MenuItem value="mdy">MM/DD/YYYY</MenuItem>
                        <MenuItem value="dmy">DD/MM/YYYY</MenuItem>
                        <MenuItem value="ymd">YYYY/MM/DD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
              
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Security Settings</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Session Timeout</InputLabel>
                      <Select defaultValue="30" label="Session Timeout">
                        <MenuItem value="15">15 minutes</MenuItem>
                        <MenuItem value="30">30 minutes</MenuItem>
                        <MenuItem value="60">1 hour</MenuItem>
                        <MenuItem value="120">2 hours</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Password Policy</InputLabel>
                      <Select defaultValue="strong" label="Password Policy">
                        <MenuItem value="basic">Basic (8+ characters)</MenuItem>
                        <MenuItem value="medium">Medium (8+ chars, must include numbers)</MenuItem>
                        <MenuItem value="strong">Strong (8+ chars, numbers, special chars)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable Two-Factor Authentication"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-lock account after 5 failed login attempts"
                    />
                  </Grid>
                </Grid>
              </Card>
              
              <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Integration Settings</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Gateway</InputLabel>
                      <Select defaultValue="stripe" label="Payment Gateway">
                        <MenuItem value="stripe">Stripe</MenuItem>
                        <MenuItem value="paypal">PayPal</MenuItem>
                        <MenuItem value="square">Square</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="API Key"
                      type="password"
                      defaultValue="sk_test_••••••••••••••••"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable Google Calendar Integration"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Enable SMS Notifications (Twilio)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" startIcon={<RefreshIcon />}>
                      Test API Connections
                    </Button>
                  </Grid>
                </Grid>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary">
                  Save System Settings
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

// Main App component that puts everything together
export  function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Function to render the appropriate content based on the selected page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <CustomersContent />;
      case 'vendors':
        return <VendorsContent />;
      case 'bookings':
        return <BookingsContent />;
      case 'payments':
        return <PaymentsContent />;
      case 'reports':
        return <ReportsContent />;
      case 'support':
        return <SupportContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };
  
  const drawer = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <EventIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          EventConnect
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'users'}
            onClick={() => setCurrentPage('users')}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'vendors'}
            onClick={() => setCurrentPage('vendors')}
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary="Vendor Management" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'bookings'}
            onClick={() => setCurrentPage('bookings')}
          >
            <ListItemIcon>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Booking Management" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'payments'}
            onClick={() => setCurrentPage('payments')}
          >
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary="Payment Management" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'reports'}
            onClick={() => setCurrentPage('reports')}
          >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports & Analytics" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'support'}
            onClick={() => setCurrentPage('support')}
          >
            <ListItemIcon>
              <SupportIcon />
            </ListItemIcon>
            <ListItemText primary="Support & Disputes" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === 'settings'}
            onClick={() => setCurrentPage('settings')}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Documentation" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EventConnect Admin
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Toolbar /> This creates space under the app bar
        {renderContent()}
      </Box>
    </Box>
  );
}

// export const App;

// Sample data for charts
const revenueData = [
  { month: 'Jan', revenue: 25000, bookings: 125 },
  { month: 'Feb', revenue: 30000, bookings: 148 },
  { month: 'Mar', revenue: 28000, bookings: 135 },
  { month: 'Apr', revenue: 32000, bookings: 162 },
  { month: 'May', revenue: 40000, bookings: 190 },
  { month: 'Jun', revenue: 45000, bookings: 210 },
];

const bookingTypeData = [
  { name: 'Weddings', value: 35 },
  { name: 'Corporate', value: 25 },
  { name: 'Birthday', value: 20 },
  { name: 'Anniversary', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];