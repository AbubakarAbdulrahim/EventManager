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



const bookingTypeData = [
    { name: 'Weddings', value: 35 },
    { name: 'Corporate', value: 25 },
    { name: 'Birthday', value: 20 },
    { name: 'Anniversary', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];

  const revenueData = [
    { month: 'Jan', revenue: 25000, bookings: 125 },
    { month: 'Feb', revenue: 30000, bookings: 148 },
    { month: 'Mar', revenue: 28000, bookings: 135 },
    { month: 'Apr', revenue: 32000, bookings: 162 },
    { month: 'May', revenue: 40000, bookings: 190 },
    { month: 'Jun', revenue: 45000, bookings: 210 },
  ];
  

  export default function Reports() {
    const [reportPeriod, setReportPeriod] = useState('monthly');
    
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