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
import SnackBarNotification from '../../components/SnackBarNotification';

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
import { useNotifications } from '../../context/NotificationContext';

const transformedData= (data) => {
    return data.map((service) => ({
      id: service.id,
      name: service.service_name,
      vendor: service.vendor,
      price: service.pricing[0].base_price,
      status: service.status,
      bookings: 10,
      rating:4.7,
    }));
  }
  
 export default function Services() {
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [services, setServices] = useState([])
    const {authAxios} =useAuth()
    const {fetchServices} = useServiceContext()
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const {addNotification} = useNotifications()

    useEffect(() => {
      const fetchService = async () => {
        try {
          const response = await fetchServices();
          const transformedServices = transformedData(response);
          setServices(transformedServices);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };

      fetchService();
    }, [snackbarOpen]);

    const handleAction = async (id, action)=>{
      try{
        const res = await authAxios.post(`api-admin/service/${id}/suspend-activate/`, {action: action})
        addNotification({
          title: "Services Management",
          message: res.data.detail,
          type: action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'warning'
        })
      } catch (error){
        console.error(error)
      }
    }
    
    return (
      <Grid container spacing={3} padding={3}>
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
                      <TableCell align="right">₦{service.price}</TableCell>
                      <TableCell align="center">{service.bookings}</TableCell>
                      <TableCell align="center">{service.rating}</TableCell>
                      <TableCell>
                        <Chip 
                          label={(service.status).charAt(0).toUpperCase() + (service.status).slice(1)} 
                          color={service.status === 'approved' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined">View</Button>
                          {service.status === 'pending' ? (
                            <>
                              <Button size="small" variant="outlined" color="success" onClick={()=>{handleAction(service.id,'approve')}} >Approve</Button>
                              <Button size="small" variant="outlined" color="error" onClick={()=>{handleAction(service.id,'reject')}} >Reject</Button>
                            </>
                          ) : (
                            <Button size="small" variant="outlined" color={service.status === 'approved' ? 'error' : 'succes'} onClick={()=>{handleAction(service.id, service.status === 'approved' ? 'suspend' : 'approve' )}} >
                              {service.status === 'approved' ? 'Suspend' : 'Activate'}
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
      <SnackBarNotification snackbarOpen={snackbarOpen} snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} handleCloseSnackbar={()=>{setSnackbarOpen(false)}} />
      </Grid>
    );
  }