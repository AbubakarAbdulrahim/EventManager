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
import { useAuth } from '../../context/AuthContext';

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


// const customers = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-123-4567', bookings: 5, joinDate: '2024-01-15', status: 'Active' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543', bookings: 3, joinDate: '2024-02-10', status: 'Active' },
//     { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '555-555-5555', bookings: 2, joinDate: '2024-03-05', status: 'Active' },
//     { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '555-444-3333', bookings: 7, joinDate: '2023-11-20', status: 'Active' },
//     { id: 5, name: 'Robert Brown', email: 'robert@example.com', phone: '555-222-1111', bookings: 0, joinDate: '2024-04-02', status: 'Suspended' },
//   ];



  export default function Customers(params) {
    
        const [searchTerm, setSearchTerm] = useState('');
        const [open, setOpen] = useState(false);
        const [openAdd, setOpenAdd] = useState(false);
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedCustomer, setSelectedCustomer] = useState(null);
        const [snackbarOpen, setSnackbarOpen] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState('');
        const [snackbarSeverity, setSnackbarSeverity] = useState('success');
        const [customers, setCustomers] = useState([]);
        const {authAxios} = useAuth();
      

        useEffect(()=>{
          authAxios.get('api-admin/users/')
          .then(response => {
            console.log(response.data);
            const transformed = response.data.map(user => {
              return ({
                id: user.id,
                name: user.full_name,
                email: user.email,
                phone: user.phone_number,
                status: user.is_active,
                joinDate: user.date_joined.split('T')[0],
                // lastLogin: user.last_login.split('T')[0],
              })
            }
          )
          setCustomers(transformed)
        })
          .catch(err => {
            console.log(err);
          });
        },[])


        const handleAction = async (customer)=>{
          try {
            const response = await authAxios.post(`api-admin/users/${customer.id}/suspend-activate/`);
            console.log(response);
            if (response.status === 200) {
              const updatedCustomers = customers.map(a =>
                a.id === customer.id ? { ...a, status : a.status? false : true } : a
              );
              setCustomers(updatedCustomers);
        
              if (selectedCustomer?.id === customer.id) {
                setSelectedApplication({ ...customer, status : customer.status? false : true });
              }
            
              
              setSnackbarMessage(`Customer ${customer.status ? 'suspended' : 'activated'} successfully!`);
              setSnackbarSeverity(customer.status ? 'error' : 'success');
              setSnackbarOpen(true);
            }
          } catch (error) {
            console.error('Error performing action:', error);
            setSnackbarMessage('Error updating application status');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        }


        const filteredCustomers = customers.filter(customer => 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
        return (
            <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom textAlign={'center'} p={2}>
                Customer Management
            </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* <Button variant="contained" fullWidth startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAdd(true);
                        }}
                    >
                      Add Customer
                    </Button> */}
                    <TextField
                      size="small"
                      fullWidth
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
                        {/* <TableCell align="center">Bookings</TableCell> */}
                        <TableCell>Join Date</TableCell>
                        {/* <TableCell>Last Login</TableCell> */}
                        <TableCell align='center'>Status</TableCell>
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
                          {/* <TableCell align="center">{customer.bookings}</TableCell> */}
                          <TableCell>{customer.joinDate}</TableCell>
                          {/* <TableCell>{customer.lastLogin}</TableCell> */}
                          <TableCell align='center'>
                            <Chip 
                              label={customer.status ? 'Active' : 'Suspended' } 
                              color={customer.status ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={()=>{
                                setSelectedCustomer(customer);
                                setOpen(true);
                              }} 
                              >
                                View
                              </Button>
                              <Button 
                              size="small" 
                              variant="outlined" 
                              color={customer.status ? 'error' : 'success'}
                              onClick={()=>{
                                handleAction(customer)
                              }}
                              >
                                {customer.status ? 'Suspend' : 'Activate'}
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
          
            <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Feedback
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Feedback</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>Great service!</TableCell>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            </Box>

            <Dialog open={openAdd} onClose={() => {setOpenAdd(false)}} fullWidth maxWidth="sm">
                <DialogTitle>Add Customer</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField label="Name" variant="outlined" fullWidth />
                        <TextField label="Username" variant="outlined" fullWidth />
                        <TextField label="Password" variant="outlined" type="password" fullWidth />
                      <TextField label="Email" variant="outlined" fullWidth />
                      <TextField label="Phone" variant="outlined" fullWidth />
                      
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select defaultValue="" label="Status">
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="suspended">Suspended</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setOpen(false)}} color="primary">
                        Add Customer
                    </Button>
                    <Button onClick={() => {setOpen(false)}} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            
            <Dialog open={open} onClose={() => {}}>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogContent>
                <DialogContentText>
                    {selectedCustomer ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h6">Name: {selectedCustomer.name}</Typography>
                            <Typography variant="body1">Email: {selectedCustomer.email}</Typography>
                            <Typography variant="body1">Phone: {selectedCustomer.phone}</Typography>
                            {/* <Typography variant="body1">Bookings: {selectedCustomer.bookings}</Typography> */}
                            <Typography variant="body1">Join Date: {selectedCustomer.joinDate}</Typography>
                            <Typography variant="body1">Status: {selectedCustomer.status ? 'Active' : 'Suspended' }</Typography>
                        </Box>
                        ) : (
                        <LinearProgress />
                        )}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {setOpen(false)}}>Close</Button>
              </DialogActions>
            </Dialog>
          
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => {setSnackbarOpen(false)}} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => {setSnackbarOpen(false)}} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage} 
          </Alert>
        </Snackbar>


        </Box>

        );
}