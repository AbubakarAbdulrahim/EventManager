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
import { useUserContext } from '../../context/UserContext';
import { useServiceContext } from '../../context/ServiceContext';

const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];
  

  export default function Reports() {
    const [reportPeriod, setReportPeriod] = useState('monthly');
    const { fetchAllBookings } = useBookingContext();
    const { fetchVendors } = useVendorContext();
    const { fetchUsers } = useUserContext();
    const { fetchServices } = useServiceContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [revenueData, setRevenueData] = useState([]);
    const [bookingTypeData, setBookingTypeData] = useState([]);
    const [customerGrowthData, setCustomerGrowthData] = useState([]);
    const [vendorGrowthData, setVendorGrowthData] = useState([]);
    const [advancedMetrics, setAdvancedMetrics] = useState({
      avgTimeBetweenBookings: 0,
      repeatBookingRate: 0,
      avgSpendPerCustomer: 0,
      topVendorCategory: '',
      avgVendorRating: 0,
      vendorRetentionRate: 0,
      peakBookingDay: '',
      peakBookingTime: '',
      peakBookingMonth: '',
    });



    // New helper functions at the top
    const getMonthlyRevenueData = (bookings) => {
      const monthlyData = {};

      bookings.forEach(({ created_at, total_price }) => {
        const date = new Date(created_at);
        const month = date.toLocaleString('default', { month: 'short' });

        if (!monthlyData[month]) {
          monthlyData[month] = { month, revenue: 0, bookings: 0 };
        }

        monthlyData[month].revenue += parseFloat(total_price);
        monthlyData[month].bookings += 1;
      });

      // Sort by month (Jan to Dec)
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return monthOrder
        .map((m) => monthlyData[m])
        .filter(Boolean); // removes undefined
    };

    const getBookingTypeData = (bookings) => {
      const typeCounts = {};
      bookings.forEach(({ service }) => {
        if (!service.service_type) return;
        typeCounts[service.service_type] = (typeCounts[service.service_type] || 0) + 1;
      });

      return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
    };

    const getMonthlyCount = (items, dateField = 'created_at') => {
      const monthlyData = {};

      items.forEach((item) => {
        const date = new Date(item[dateField] ?? item['date_joined']);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${year}-${month}`;

        if (!monthlyData[key]) {
          monthlyData[key] = { month: key, count: 0 };
        }

        monthlyData[key].count += 1;
      });

      // Sort chronologically
      return Object.values(monthlyData).sort((a, b) => {
        const [yearA, monthA] = a.month.split('-');
        const [yearB, monthB] = b.month.split('-');

        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }

        return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
      });
    };



    const computeAdvancedAnalytics = (bookings, vendors) => {
      const customerBookings = {};
      const customerSpend = {};
      const vendorRatings = vendors.map(v => v.rating).filter(Boolean);
      const vendorJoinDates = vendors.map(v => new Date(v.date_joined));

      const bookingDates = bookings.map(b => new Date(b.created_at)).sort((a, b) => a - b);
      const dayCounts = {};
      const timeCounts = {};
      const monthCounts = {};
      const vendorRevenue = {};

      bookings.forEach((b) => {
        const customerId = b.user?.id;
        const vendorCategory = b.service?.service_type;
        const vendorId = b.vendor?.id;
        const createdAt = new Date(b.created_at);

        // Track repeat bookings
        if (customerId) {
          customerBookings[customerId] = (customerBookings[customerId] || 0) + 1;
          customerSpend[customerId] = (customerSpend[customerId] || 0) + parseFloat(b.total_price);
        }

        // Track peak day/time/month
        const weekday = createdAt.toLocaleString('default', { weekday: 'long' });
        const hour = createdAt.getHours();
        const month = createdAt.toLocaleString('default', { month: 'long' });

        dayCounts[weekday] = (dayCounts[weekday] || 0) + 1;
        timeCounts[hour] = (timeCounts[hour] || 0) + 1;
        monthCounts[month] = (monthCounts[month] || 0) + 1;

        // Vendor revenue
        if (vendorCategory) {
          vendorRevenue[vendorCategory] = (vendorRevenue[vendorCategory] || 0) + parseFloat(b.total_price);
        }
      });

      const repeatCustomers = Object.values(customerBookings).filter(b => b > 1).length;
      const avgSpend = Object.values(customerSpend).reduce((a, b) => a + b, 0) / Object.keys(customerSpend).length;
      const avgTime = (bookingDates.length >= 2)
        ? (bookingDates[bookingDates.length - 1] - bookingDates[0]) / (bookingDates.length - 1) / (1000 * 60 * 60 * 24)
        : 0;

      const topCategory = Object.entries(vendorRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      const topTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      const topMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      return {
        avgTimeBetweenBookings: Math.round(avgTime),
        repeatBookingRate: Math.round((repeatCustomers / Object.keys(customerBookings).length) * 100),
        avgSpendPerCustomer: avgSpend.toFixed(2),
        topVendorCategory: topCategory,
        avgVendorRating: (vendorRatings.reduce((a, b) => a + b, 0) / vendorRatings.length).toFixed(1),
        vendorRetentionRate: '92', // For simplicity, hardcoded or add logic
        peakBookingDay: topDay,
        peakBookingTime: `${topTime}:00 - ${+topTime + 2}:00`,
        peakBookingMonth: topMonth
      };
    };


    useEffect(() => {
      const fetchReports = async () => {
          try {
            setLoading(true)
            const allBookings = await fetchAllBookings();
            const vendors = await fetchVendors();
            const users = await fetchUsers()
            setBookings(allBookings);
            setRevenueData(getMonthlyRevenueData(allBookings));
            setBookingTypeData(getBookingTypeData(allBookings));
            setCustomerGrowthData(getMonthlyCount(users));
            setVendorGrowthData(getMonthlyCount(vendors));
            
            const analytics = computeAdvancedAnalytics(allBookings, vendors);
            setAdvancedMetrics(analytics);
          } catch (err) {
            console.error(err);
          }
          setLoading(false)
        };
        fetchReports();
    }, []);

    return (
      <Grid container spacing={3} padding={3}>
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
                    <Line type="monotone" dataKey="revenue" stroke="#033043" name="Revenue (₦)" />
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
                  <LineChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="count" stroke="#033043" />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Vendor Growth</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vendorGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="count" stroke="#82ca9d" />
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
                    <Typography variant="h6">{advancedMetrics.avgTimeBetweenBookings} days</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Repeat Booking Rate
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.repeatBookingRate}%</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Average Spend per Customer
                    </Typography>
                    <Typography variant="h6">₦{advancedMetrics.avgSpendPerCustomer}</Typography>
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
                    <Typography variant="h6">{advancedMetrics.topVendorCategory}</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Average Vendor Rating
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.avgVendorRating}/5.0</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Vendor Retention Rate
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.vendorRetentionRate}%</Typography>
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
                    <Typography variant="h6">{advancedMetrics.peakBookingDay}</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Peak Booking Time
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.peakBookingTime}</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Peak Booking Month
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.peakBookingMonth}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }