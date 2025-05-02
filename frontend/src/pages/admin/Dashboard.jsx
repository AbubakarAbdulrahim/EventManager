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


const recentBookings = [
    { id: 'BK001', customer: 'John Doe', service: 'Photography', vendor: 'ProShots Inc.', date: '2025-04-22', amount: 1200, status: 'Completed' },
    { id: 'BK002', customer: 'Jane Smith', service: 'Catering', vendor: 'Delicious Foods', date: '2025-04-23', amount: 2500, status: 'Upcoming' },
    { id: 'BK003', customer: 'Mike Johnson', service: 'Venue', vendor: 'Grand Ballroom', date: '2025-04-25', amount: 5000, status: 'Pending' },
    { id: 'BK004', customer: 'Sarah Williams', service: 'DJ Services', vendor: 'Beat Masters', date: '2025-04-20', amount: 800, status: 'Completed' },
    { id: 'BK005', customer: 'Robert Brown', service: 'Decor', vendor: 'Elegant Designs', date: '2025-04-24', amount: 1500, status: 'Cancelled' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 25000, bookings: 125 },
    { month: 'Feb', revenue: 30000, bookings: 148 },
    { month: 'Mar', revenue: 28000, bookings: 135 },
    { month: 'Apr', revenue: 32000, bookings: 162 },
    { month: 'May', revenue: 40000, bookings: 190 },
    { month: 'Jun', revenue: 45000, bookings: 210 },
  ];

  const bookingStatusData = [
    { name: 'Completed', value: 87 },
    { name: 'Cancelled', value: 13 },
  ];

  const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];

export default function Dashboard() {
    return (
      <Grid container spacing={3} padding={3}>
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
  