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
import { useAuth } from '../../context/AuthContext';
import { useServiceContext } from '../../context/ServiceContext';
import { useVendorContext } from '../../context/VendorContext';
import { useBookingContext } from '../../context/BookingsContext';



  const initialFeedback = [
    { id: 1, customerId: 1, feedback: 'Great service!', response: '' },
    { id: 2, customerId: 2, feedback: 'Very satisfied with the product.', response: '' },
    { id: 3, customerId: 3, feedback: 'Could be better.', response: '' },
  ];
const COLORS = ['#033043', '#0a7273', '#FFBB28', '#FF8042'];
const transformedData = (servicesData, bookings) => {
  const bookingCounts = {};

  bookings.forEach(booking => {
    const serviceId = booking.service.id;
    if (!bookingCounts[serviceId]) {
      bookingCounts[serviceId] = 0;
    }
    bookingCounts[serviceId]++;
  });

  return servicesData.map(service => {
    const price = service.pricing[0].base_price;
    const customerCount = bookingCounts[service.id] || 0;
    return {
      id: service.id,
      name: service.service_name,
      description: service.description,
      price,
      isActive: service.status,
      customers: customerCount,
      income: price * customerCount,
      service_images: service.service_images,
    };
  });
};

export default function Dashboard ({setCurrentPage}){
    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [feedback, setFeedback] = useState(initialFeedback);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [responseText, setResponseText] = useState('');
    const {user} = useAuth()
    const {fetchServices} = useServiceContext()
    const {fetchVendors} = useVendorContext()
    const {fetchVendorBookings} = useBookingContext()
 
    useEffect(()=>{
          fetchBookings()
        },[])
    
        const fetchBookings = async () =>{
          try{
            
            const vendors = await fetchVendors();
            const vendor = vendors.find(v => v.user.id === user.id);
            const vendorId = vendor?.id;

            const allBookings = await fetchVendorBookings();


            const allServices = await fetchServices();
            const vendorServices = allServices.filter(s => s.vendor === vendorId);

            const transformedServices = transformedData(vendorServices, allBookings);

            const grouped = {};
    
            allBookings.forEach((item) => {
              const userId = item.user.id;
              if (!grouped[userId]) {
                grouped[userId] = {
                  id: userId,
                  user: item.user,
                  services: [],
                  bookings: [],
                  totalSpent: item.total_price
                };
              }
              grouped[userId].services.push(item.service);
              grouped[userId].bookings.push(item.service);
            });
            setServices(transformedServices)
            setCustomers(Object.values(grouped))
          } catch(err){
            console.error(err)
          }
        }

    const handleRespond = (feedbackId) => {
        const feedbackItem = feedback.find(item => item.id === feedbackId);
        console.log(feedbackItem);
        if (feedbackItem) {
            setSelectedFeedback(feedbackItem);
            setResponseText(feedbackItem.response || '');
            setOpenFeedbackDialog(true);
        }
    };

    const handleCloseFeedbackDialog = () => {
        setOpenFeedbackDialog(false);
        setSelectedFeedback(null);
        setResponseText('');
    };

    const handleSendResponse = () => {
        if (selectedFeedback) {
            const updatedFeedback = feedback.map(item => {
                if (item.id === selectedFeedback.id) {
                    return { ...item, response: responseText };
                }
                return item;
            });
            setFeedback(updatedFeedback);
            setOpenFeedbackDialog(false);
            setSelectedFeedback(null);
            setResponseText('');
        }
    };

    const handleDeleteFeedback = (feedbackId) => {
        const updatedFeedback = feedback.filter(item => item.id !== feedbackId);
        setFeedback(updatedFeedback);
    };

    const handleRefresh = () => {
        // Simulate a refresh action (e.g., fetching new data)
        
        setFeedback(initialFeedback);
        setOpenFeedbackDialog(false);
        setSelectedFeedback(null);
        setResponseText('');
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filteredServices = services.filter(service => service.name.toLowerCase().includes(query));
        const filteredCustomers = customers.filter(customer => customer.name.toLowerCase().includes(query));
        setServices(filteredServices);
        setCustomers(filteredCustomers);
    };

    const handleFilter = (event) => {
        const filterValue = event.target.value;
        if (filterValue === 'active') {
            const filteredServices = services.filter(service => service.isActive);
            setServices(filteredServices);
        } else if (filterValue === 'inactive') {
            const filteredServices = services.filter(service => !service.isActive);
            setServices(filteredServices);
        }
        else {
            setServices(services);
        }
    };



    const getTotalIncome = () => {
        return services.reduce((total, service) => total + service.income, 0);
      };

      const getActiveServices = () => {
        return services.filter(service => service.isActive).length;
      };


      

  return  (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
            <Grid item xs={12} md={3}>
                <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 140,
                    bgcolor: 'primary.light',
                    color: 'white'
                }}
                >
                <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                    Total Services
                </Typography>
                <Typography component="p" variant="h4">
                    {services.length}
                </Typography>
                <Typography color="inherit" sx={{ flex: 1 }}>
                    services offered
                </Typography>
                </Paper>
            </Grid>
            
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#0d47a1',
                color: 'white'
              }}
            >
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Total Revenue
              </Typography>
              <Typography component="p" variant="h4">
                ₦{getTotalIncome().toLocaleString()}
              </Typography>
              <Typography color="inherit" sx={{ flex: 1 }}>
                from {services.length} services
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#0a7273',
                color: 'white'
              }}
            >
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Active Services
              </Typography>
              <Typography component="p" variant="h4">
                {getActiveServices()}
              </Typography>
              <Typography color="inherit" sx={{ flex: 1 }}>
                out of {services.length} total services
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#fda521',
                color: 'white'
              }}
            >
              <Typography component="h2" variant="h6" color="inherit" gutterBottom>
                Total Customers
              </Typography>
              <Typography component="p" variant="h4">
                {customers.length}
              </Typography>
              <Typography color="inherit" sx={{ flex: 1 }}>
                across all services
              </Typography>
            </Paper>
          </Grid>
  
          {/* Recent Services */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Services
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.slice(0, 5).map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>₦{service.price}</TableCell>
                      <TableCell>
                        {service.isActive ? (
                          <Chip size="small" color="success" label="Active" />
                        ) : (
                          <Chip size="small" color="default" label="Inactive" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 3 }}>
                <Button color="primary" onClick={() => setCurrentPage('services')}>
                  View all services
                </Button>
              </Box>
            </Paper>
          </Grid>
  
          {/* Recent Customers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Customers
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.slice(0, 5).map((customer) => (
                    <TableRow key={customer.user.id}>
                      <TableCell>{customer.user.full_name}</TableCell>
                      <TableCell>{customer.user.full_name}</TableCell>
                      <TableCell>₦{customer.totalSpent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 3 }}>
                <Button color="primary" onClick={() => setCurrentPage('customers')}>
                  View all customers
                </Button>
              </Box>
            </Paper>
          </Grid>


            {/* Income Chart */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Income Chart
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[...services].sort((a, b) => a.income - b.income)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                </Paper>
                </Grid>

            {/* Customer Demographics Chart */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Customer Demographics
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                        data={customers.map(c => ({
                          name: c.user.full_name,
                          value: parseFloat(c.totalSpent)
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#033043"
                        label
                      >
                        {customers.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                </Paper>
                </Grid>

            {/* Customer Feedback */}
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Customer Feedback
                    </Typography>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell>Action</TableCell>
                        
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>{customer.user.full_name}</TableCell>
                            <TableCell>{feedback.find(item => item.customerId === customer.id)?.feedback || 'No feedback'}</TableCell>
                            <TableCell >
                            <Button variant="contained" color="primary" size="small" onClick={() => handleRespond(customer.id)}>
                                Respond
                            </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </Paper>
                </Grid>

                

        </Grid>

        <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog}>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Respond to the feedback from {selectedFeedback ? customers.find(customer => customer.id === selectedFeedback.customerId).name : ''}
                </DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                id="response"
                label="Response"
                type="text"
                fullWidth
                variant="outlined"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseFeedbackDialog} color="primary">
                Cancel
                </Button>
                <Button onClick={handleSendResponse} color="primary">
                Send Response
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={openFeedbackDialog} autoHideDuration={6000} onClose={handleCloseFeedbackDialog}>
            <Alert onClose={handleCloseFeedbackDialog} severity="success" sx={{ width: '100%' }}>
                Response sent successfully!
            </Alert>
        </Snackbar>
                        

      </Container>
    );
} 