import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Box, CssBaseline, Divider, Container, Grid, Paper, Card, CardContent, CardActions, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, 
  Avatar, Chip, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, 
  Alert, CircularProgress, Badge, ThemeProvider, createTheme, useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, AddCircle, Delete, Edit, Visibility, 
  VisibilityOff, Person, Business, AttachMoney, Settings as SettingsIcon, 
  Logout, Menu as MenuIcon, Search, CheckCircle, Cancel, Star
} from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Mock data
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

// Context
const AppContext = createContext();

function VendorDashboard() {
  const [services, setServices] = useState(initialServices);
  const [customers, setCustomers] = useState(initialCustomers);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAddService = (newService) => {
    const serviceId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const serviceToAdd = {
      ...newService,
      id: serviceId,
      customers: 0,
      income: 0
    };
    setServices([...services, serviceToAdd]);
    setServiceFormOpen(false);
  };

  const handleEditService = (updatedService) => {
    setServices(
      services.map(service => 
        service.id === updatedService.id ? { ...service, ...updatedService } : service
      )
    );
    setServiceFormOpen(false);
    setEditingService(null);
  };

  const toggleServiceStatus = (serviceId) => {
    setServices(
      services.map(service => 
        service.id === serviceId ? { ...service, isActive: !service.isActive } : service
      )
    );
  };

  const openEditServiceForm = (service) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };

  const getTotalIncome = () => {
    return services.reduce((total, service) => total + service.income, 0);
  };

  const getActiveServices = () => {
    return services.filter(service => service.isActive).length;
  };

  // Dashboard component
  const Dashboard = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" color="inherit" gutterBottom>
              Total Revenue
            </Typography>
            <Typography component="p" variant="h4">
              ${getTotalIncome().toLocaleString()}
            </Typography>
            <Typography color="inherit" sx={{ flex: 1 }}>
              from {services.length} services
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
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
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
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
                    <TableCell>${service.price}</TableCell>
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
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.company}</TableCell>
                    <TableCell>${customer.totalSpent}</TableCell>
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
      </Grid>
    </Container>
  );

  // Services component
  const Services = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Services
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddCircle />}
          onClick={() => {
            setEditingService(null);
            setServiceFormOpen(true);
          }}
        >
          Add Service
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Customers</TableCell>
              <TableCell>Income</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell>{service.customers}</TableCell>
                <TableCell>${service.income}</TableCell>
                <TableCell>
                  {service.isActive ? (
                    <Chip color="success" label="Active" />
                  ) : (
                    <Chip color="default" label="Inactive" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={() => openEditServiceForm(service)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleServiceStatus(service.id)}
                  >
                    {service.isActive ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Service Form Dialog */}
      <Dialog 
        open={serviceFormOpen} 
        onClose={() => {
          setServiceFormOpen(false);
          setEditingService(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <Formik
          initialValues={
            editingService 
              ? { ...editingService } 
              : { name: '', description: '', price: '', isActive: true }
          }
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            description: Yup.string().required('Description is required'),
            price: Yup.number()
              .required('Price is required')
              .positive('Price must be positive'),
          })}
          onSubmit={values => {
            const serviceData = {
              ...values,
              price: Number(values.price)
            };
            
            if (editingService) {
              handleEditService(serviceData);
            } else {
              handleAddService(serviceData);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Service Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Box>
                
                <Box mb={2}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Box>
                
                <Box mb={2}>
                  <TextField
                    fullWidth
                    id="price"
                    name="price"
                    label="Price ($)"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={values.isActive}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </DialogContent>
              
              <DialogActions>
                <Button 
                  onClick={() => {
                    setServiceFormOpen(false);
                    setEditingService(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="contained" 
                  color="primary"
                  disabled={isSubmitting}
                >
                  {editingService ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Container>
  );

  // Customers component
  const Customers = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Customers
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.company}</TableCell>
                <TableCell>
                  {customer.services.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    return service ? (
                      <Chip 
                        key={serviceId}
                        label={service.name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ) : null;
                  })}
                </TableCell>
                <TableCell>${customer.totalSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );

  // Income component
  const Income = () => {
    const [period, setPeriod] = useState('monthly');
    
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

  // Settings component
  const Settings = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Account Settings
        </Typography>
        
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Name"
                defaultValue="My Business"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                defaultValue="vendor@example.com"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                defaultValue="(555) 123-4567"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Currency"
                defaultValue="USD"
                margin="normal"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        
        <FormControlLabel
          control={<Switch defaultChecked color="primary" />}
          label="Email notifications for new customers"
        />
        <FormControlLabel
          control={<Switch defaultChecked color="primary" />}
          label="Email notifications for payments"
        />
        <FormControlLabel
          control={<Switch color="primary" />}
          label="SMS notifications"
        />
      </Paper>
    </Container>
  );

  // Drawer items
  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
    { text: 'Services', icon: <Business />, page: 'services' },
    { text: 'Customers', icon: <Person />, page: 'customers' },
    { text: 'Income', icon: <AttachMoney />, page: 'income' },
    { text: 'Settings', icon: <SettingsIcon />, page: 'settings' },
  ];

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <Services />;
      case 'customers':
        return <Customers />;
      case 'income':
        return <Income />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Vendor Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            selected={currentPage === item.page}
            onClick={() => {
              setCurrentPage(item.page);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {drawerItems.find(item => item.page === currentPage)?.text || 'Dashboard'}
          </Typography>
          <IconButton color="inherit">
            <Search />
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Person />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}

// Export the component
export default VendorDashboard;