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
import AddServiceDialog from './AddServiceDialog';
import { useAuth } from '../../context/AuthContext';


const initialServices = [
    { id: 1, name: 'Web Development', description: 'Custom website development services', price: 1500, isActive: true, customers: 12, income: 18000 },
    { id: 2, name: 'Logo Design', description: 'Professional logo design service', price: 350, isActive: true, customers: 25, income: 8750 },
    { id: 3, name: 'SEO Optimization', description: 'Search engine optimization services', price: 750, isActive: false, customers: 8, income: 6000 },
  ];

  const transformedData= (data) => {
    console.log(data);
    return data.map((service) => ({
      id: service.id,
      name: service.service_name,
      description: service.description,
      price: service.pricing[0].base_price,
      isActive: service.status,
      customers: service.customers || 10,
      income: service.pricing[0].base_price * (service.customers || 10),
    }));
  }

export default function Services  () {
    const { authAxios } = useAuth();
    const [services, setServices] = useState(initialServices);
    const [serviceFormOpen, setServiceFormOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    
    const handleClose = () => {
        setServiceFormOpen(false);
        setEditingService(null);
    }

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await authAxios.get('vendors/services/');
                const transformedServices = transformedData(response.data);
                setServices(transformedServices);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    
    }, []);



    return(

    <Container maxWidth="lg" sx={{ p:3 }}>
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Customers</TableCell>
              <TableCell>Income</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell align='center' >₦{service.price}</TableCell>
                <TableCell align='center'>{service.customers}</TableCell>
                <TableCell>₦{service.income}</TableCell>
                <TableCell align='center'>
                  {service.isActive ? (
                    <Chip color="success" label="Active" />
                  ) : (
                    <Chip color="default" label="Inactive" />
                  )}
                </TableCell>
                <TableCell sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size='small'
                    onClick={() => {
                      setEditingService(service);
                      setServiceFormOpen(true);
                    }}
                  >
                    Edit
                    </Button>
                    <Button
                    variant="outlined"
                    size='small'
                    color="error"
                    onClick={() => {
                      setServices(services.filter((s) => s.id !== service.id));
                    }}
                  >
                    Delete
                    </Button>
                    <Button
                    variant="outlined"
                    size='small'
                    color={service.isActive ? 'warning' : 'success'}
                    onClick={() => {
                      setServices(services.map((s) => 
                        s.id === service.id ? { ...s, isActive: !s.isActive } : s
                      ));
                    }}
                    >
                    {service.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Service Form Dialog */}
      <AddServiceDialog open={serviceFormOpen} onClose={handleClose} />
      <Dialog 
        // open={serviceFormOpen} 
        // onClose={() => {
        //   setServiceFormOpen(false);
        //   setEditingService(null);
        // }}
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
                    label="Price (₦)"
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
    )

}