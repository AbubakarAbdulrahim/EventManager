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
import {
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Support as SupportIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
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
import { useBookingContext } from '../../context/BookingsContext';
import { useVendorContext } from '../../context/VendorContext';
import { useServiceContext } from '../../context/ServiceContext';
import { useUserContext } from '../../context/UserContext';
import { useNotifications } from '../../context/NotificationContext';


  const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];
  const systemAlerts = [
  {
    id: 'vendor-apps',
    type: 'error',
    priority: 'high',
    category: 'Applications',
    title: '5 vendor applications require review',
    message: 'New vendor applications are waiting for admin approval',
    subtitle: 'Last application received 2 hours ago',
    count: 5,
    icon: <AssignmentIcon />,
    action: 'Review',
    actionType: 'contained',
    badgeColor: 'error'
  },
  {
    id: 'support-tickets',
    type: 'warning',
    priority: 'medium',
    category: 'Support',
    title: '3 customer support tickets awaiting response',
    message: 'Customer support tickets need immediate attention',
    subtitle: 'Oldest ticket was created 5 hours ago',
    count: 3,
    icon: <SupportIcon />,
    action: 'View',
    actionType: 'contained',
    badgeColor: 'warning'
  },
  {
    id: 'maintenance',
    type: 'info',
    priority: 'low',
    category: 'System',
    title: 'System maintenance scheduled',
    message: 'Scheduled maintenance will affect system availability',
    subtitle: 'Scheduled for April 25, 2025 at 02:00 AM',
    count: null,
    icon: <BuildIcon />,
    action: 'Details',
    actionType: 'outlined',
    badgeColor: 'info'
  }
];
export default function Dashboard({setCurrentPage}) {

  const { fetchAllBookings } = useBookingContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchVendors } = useVendorContext();
  const { fetchUsers } = useUserContext();
  const { fetchServices } = useServiceContext();
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const {addNotification} =useNotifications()

  // useEffect(() => {
  //     systemAlerts.forEach(alert => {
  //       addNotification({
  //         type: alert.type,
  //         priority: alert.priority,
  //         category: alert.category,
  //         title: alert.title,
  //         message: alert.message,
  //         showToast: false, // Don't show as toast, only in bell
  //         autoHide: true
  //       });
  //     });
  //   }, []);
  
  
    const handleAlertAction = (alert) => {
      // Add a new notification when action is clicked
      addNotification({
        type: 'success',
        title: `${alert.action} Action Triggered`,
        message: `You clicked ${alert.action} for: ${alert.title}`,
        priority: 'medium',
        category: 'Action',
        showToast: true,
        duration: 3000
      });
    };
  
    const getAlertIcon = (alert) => {
      switch (alert.type) {
        case 'error':
          return <ErrorIcon color="error" />;
        case 'warning':
          return <WarningIcon color="warning" />;
        case 'info':
          return <InfoIcon color="info" />;
        default:
          return alert.icon;
      }
    };


  const getMonthlyData = () => {
  const data = {};

  bookings.forEach((booking) => {
    const date = new Date(booking.created_at);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!data[key]) {
      data[key] = { revenue: 0, bookings: 0 };
    }

    data[key].revenue += parseFloat(booking.total_price);
    data[key].bookings += 1;
  });

  const monthlyArray = Object.entries(data)
    .map(([key, values]) => {
      const [year, month] = key.split('-');
      const date = new Date(year, month);
      return {
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        ...values,
        sortKey: date.getTime(),
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ sortKey, ...rest }) => rest);

  return { monthlyArray, data }; // return both
};



    const getBookingStatusData = () => {
    const counts = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const bookingStatusData = getBookingStatusData();


    const formatDate = (isoString) => {
    const date = new Date(isoString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  const { monthlyArray: revenueData, data: monthlyData } = getMonthlyData();

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const prevMonthKey = `${prevMonth.getFullYear()}-${prevMonth.getMonth()}`;

  const currentBookings = monthlyData[currentMonthKey]?.bookings || 0;
  const prevBookings = monthlyData[prevMonthKey]?.bookings || 0;
  const bookingChange = getPercentageChange(currentBookings, prevBookings);

  const currentRevenue = monthlyData[currentMonthKey]?.revenue || 0;
  const prevRevenue = monthlyData[prevMonthKey]?.revenue || 0;
  const revenueChange = getPercentageChange(currentRevenue, prevRevenue);


  const getNewUsersThisWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return users.filter(user => new Date(user.date_joined) >= oneWeekAgo).length;
  };

  const getPendingVendors = () => {
    return vendors.filter(v => v.status !== 'approved').length;
  };






  useEffect(() => {
      const fetchBookings = async () => {
        try {
          setLoading(true)
          const allBookings = await fetchAllBookings();
          const vendors = await fetchVendors();
          // const services = await fetchServices();
          const users = await fetchUsers()
          setBookings(allBookings);
          setVendors(vendors);
          setServices(services);
          setUsers(users);

        } catch (err) {
          console.error(err);
        }
        setLoading(false)
      };
      fetchBookings();
    }, []);
    return (
      <Grid container spacing={3} padding={3}>
        {/* Key metrics */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {bookings.length}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {bookingChange >= 0
                ? `${bookingChange.toFixed(1)}% increase from last month`
                : `${Math.abs(bookingChange).toFixed(1)}% decrease from last month`}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Revenue
            </Typography>
            <Typography component="p" variant="h4">
              ₦{bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0).toLocaleString()}
            </Typography>

            <Typography variant="body2" sx={{ flex: 1 }}>
              {revenueChange >= 0
                ? `${revenueChange.toFixed(1)}% increase from last month`
                : `${Math.abs(revenueChange).toFixed(1)}% decrease from last month`}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Customers
            </Typography>
            <Typography component="p" variant="h4">
              {users.filter((user)=>(user.is_active === true)).length}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {getNewUsersThisWeek()} new this week
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Active Vendors
            </Typography>
            <Typography component="p" variant="h4">
              {vendors.filter((vendor)=>(vendor.status === 'approved')).length}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {getPendingVendors()} pending approvals
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
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#033043" activeDot={{ r: 8 }} name="Revenue (₦)" />
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
                    <TableCell>Time</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking,index) => {
                    if(index > 4) return;
                    return (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.user.full_name}</TableCell>
                      <TableCell>{booking.service.service_name}</TableCell>
                      <TableCell>{booking.vendor.business_name}</TableCell>
                      <TableCell>{formatDate(booking.created_at)}</TableCell>
                      <TableCell>{formatTime(booking.created_at)}</TableCell>
                      <TableCell align="right">₦{parseFloat(booking.total_price)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={(booking.status).charAt(0).toUpperCase() + (booking.status).slice(1)} 
                          color={
                            booking.status === 'completed' ? 'success' : 
                            booking.status === 'cancelled' ? 'error' :
                            booking.status === 'pending' ? 'default' : 'error'
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" >View</Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button color="primary" onClick={()=>{setCurrentPage('Bookings')}} >View All Bookings</Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                System Alerts & Notifications
              </Typography>
              <Chip 
                label={`${systemAlerts.filter(a => a.count).reduce((sum, a) => sum + a.count, 0)} Active`}
                color="primary"
                size="small"
              />
            </Box>
            
            <List sx={{ p: 0 }}>
              {systemAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Badge 
                        color={alert.badgeColor} 
                        variant={alert.count ? "standard" : "dot"}
                        badgeContent={alert.count}
                      >
                        {getAlertIcon(alert)}
                      </Badge>
                    </ListItemIcon>
                    
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {alert.title}
                          </Typography>
                          {alert.priority === 'high' && (
                            <Chip 
                              label="Urgent" 
                              color="error" 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.75rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {alert.subtitle}
                          </Typography>
                          <Chip 
                            label={alert.category}
                            variant="outlined"
                            size="small"
                            sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />

                    
                    <Button 
                      size="small" 
                      variant={alert.actionType}
                      color={alert.type === 'error' ? 'error' : 'primary'}
                      // onClick={() => handleAlertAction(alert)}
                      sx={{ ml: 2 }}
                    >
                      {alert.action}
                    </Button>
                  </ListItem>
                  
                  {index < systemAlerts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
    
            {/* Summary Footer */}
            <Box sx={{ 
              mt: 2, 
              pt: 2, 
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                Total: {systemAlerts.length} system alerts
              </Typography>
              <Button 
                size="small" 
                variant="text"
                onClick={() => {
                  addNotification({
                    type: 'info',
                    title: 'View All Notifications',
                    message: 'Opening comprehensive notification center...',
                    priority: 'low',
                    category: 'Navigation',
                    showToast: true,
                    duration: 2000
                  });
                }}
              >
                View All
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
  