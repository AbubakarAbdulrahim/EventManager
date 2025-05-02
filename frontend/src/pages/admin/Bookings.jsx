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
  

export default function Bookings() {
  const [statusFilter, setStatusFilter] = useState('All');

  
  return (
    <Grid container spacing={3} padding={3}>
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