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
import { useBookingContext } from '../../context/BookingsContext';
import { useVendorContext } from '../../context/VendorContext';
import { useServiceContext } from '../../context/ServiceContext';
import { useUserContext } from '../../context/UserContext';


  const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];

export default function Dashboard() {

  const { fetchAllBookings } = useBookingContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchVendors } = useVendorContext();
  const { fetchUsers } = useUserContext();
  const { fetchServices } = useServiceContext();
  const [vendors, setVendors] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);


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
    console.log(current, previous);
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
    return vendors.filter(v => v.status === 'pending').length;
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
              {users.length}
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
              {vendors.length}
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
                          label={booking.status} 
                          color={
                            booking.status === 'accepted' ? 'success' : 
                            booking.status === 'upcoming' ? 'primary' :
                            booking.status === 'pending' ? 'warning' : 'error'
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small">View</Button>
                      </TableCell>
                    </TableRow>
                  )})}
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
  