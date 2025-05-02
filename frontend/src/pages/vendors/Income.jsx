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

  const initialServices = [
    { id: 1, name: 'Web Development', description: 'Custom website development services', price: 1500, isActive: true, customers: 12, income: 18000 },
    { id: 2, name: 'Logo Design', description: 'Professional logo design service', price: 350, isActive: true, customers: 25, income: 8750 },
    { id: 3, name: 'SEO Optimization', description: 'Search engine optimization services', price: 750, isActive: false, customers: 8, income: 6000 },
  ];

  const initialCustomers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', company: 'ABC Corp', services: [1, 2], totalSpent: 1850 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', company: 'XYZ Inc', services: [1], totalSpent: 1500 },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', company: 'Acme Co', services: [2, 3], totalSpent: 1100 },
  ];

export default function Income  () {
    const [period, setPeriod] = useState('monthly');
    const [services, setServices] = useState(initialServices);
    const [customers, setCustomers] = useState(initialCustomers);


    
    const getTotalIncome = () => {
        return services.reduce((total, service) => total + service.income, 0);
      };
    const handlePeriodChange = (event, newValue) => {
      setPeriod(newValue);
    };
    
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Income Tracking
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={period} onChange={handlePeriodChange}>
            <Tab value="monthly" label="Monthly" />
            <Tab value="quarterly" label="Quarterly" />
            <Tab value="yearly" label="Yearly" />
          </Tabs>
        </Box>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Income Summary
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">
              Total Revenue: ${getTotalIncome().toLocaleString()}
            </Typography>
            <Typography variant="body1">
              Services: {services.length}
            </Typography>
            <Typography variant="body1">
              Customers: {customers.length}
            </Typography>
          </Box>
        </Paper>
        
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Customers</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>% of Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => {
                  const percentOfTotal = (service.income / getTotalIncome()) * 100;
                  
                  return (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.price}</TableCell>
                      <TableCell>{service.customers}</TableCell>
                      <TableCell>${service.income}</TableCell>
                      <TableCell>{percentOfTotal.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  };