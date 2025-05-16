import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Box, CssBaseline, Divider, Container, Grid, Paper, Card, CardContent, CardActions, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, 
  Avatar, Chip, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, 
  Alert, CircularProgress, Badge, ThemeProvider, createTheme, useTheme,
  ImageList,
    ImageListItem,
    Modal, Snackbar,
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, AddCircle, Delete, Edit, Visibility, 
  VisibilityOff, Person, Business, AttachMoney, Settings as SettingsIcon, 
  Logout, Menu as MenuIcon, Search, CheckCircle, Cancel, Star, Close as CloseIcon, ZoomIn as ZoomInIcon
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
    return data.map((service) => ({
      id: service.id,
      name: service.service_name,
      description: service.description,
      price: service.pricing[0].base_price,
      isActive: service.status,
      customers: service.customers || 10,
      income: service.pricing[0].base_price * (service.customers || 10),
      service_images: service.service_images
    }));
  }

export default function Services  () {
    const { authAxios } = useAuth();
    const [services, setServices] = useState(initialServices);
    const [serviceFormOpen, setServiceFormOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    const handleClose = () => {
        setServiceFormOpen(false);
        setEditingService(null);
    }

    const handleOpenDialog = (service) => {
      setSelectedService(service);
      setDialogOpen(true);
    };
    
    const handleCloseDialog = () => {
      setSelectedService(null);
      setDialogOpen(false);
    };

    const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl.image);
    setImageModalOpen(true);
  };

    const handleCloseImageModal = () => {
      setImageModalOpen(false);
      setSelectedImage('');
    };

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

    const handleDelete = async (serviceId) => {
      try {
      await authAxios.delete(`vendors/services/${serviceId}/delete/`);
      setServices(services.filter((service) => service.id !== serviceId));
      setSnackbarMessage('Service deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      } catch (error) {
      console.error('Error deleting service:', error);
      setSnackbarMessage('Failed to delete service.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      }
    };


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
            {services.length > 0 ? services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell sx={{maxWidth:200}} >
                  <Typography
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  >{service.description}</Typography>
                </TableCell>
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
                    onClick={() => handleOpenDialog(service)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size='small'
                    onClick={() => {
                      setEditingService(service.id);
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
                      handleDelete(service.id)
                    }}
                  >
                    Delete
                    </Button>
                </TableCell>
              </TableRow>
            )) :
            <TableRow>
                <TableCell align='center' colSpan={8}>
                    <Typography>
                      No services added yet.
                    </Typography>   
                </TableCell>
            </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* Service Form Dialog */}
      <AddServiceDialog open={serviceFormOpen} onClose={handleClose} title={editingService ? 'Edit Service' : 'Add New Service'} service={selectedService} />

      {/* Service Details Dialog */}
      {selectedService && (
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Service Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Service Information</Typography>
                    <Typography variant="body1"><strong>Name:</strong> {selectedService.name}</Typography>
                    <Typography variant="body1"><strong>Description:</strong> {selectedService.description}</Typography>
                    <Typography variant="body1"><strong>Price:</strong> ₦{selectedService.price}</Typography>
                    <Typography variant="body1"><strong>Customers:</strong> {selectedService.customers}</Typography>
                    <Typography variant="body1"><strong>Income:</strong> ₦{selectedService.income}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {selectedService.isActive ? 'Active' : 'Inactive'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Service Images:
                    </Typography>
                    
                    <ImageList cols={3} gap={16}>
                      {selectedService?.service_images.map((img, index) => (
                        <ImageListItem 
                          key={index} 
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.9,
                              transition: 'opacity 0.2s'
                            }
                          }}
                          onClick={() => handleOpenImage(img)}
                        >
                          <img
                            src={img.image}
                            alt={`Certification ${index + 1}`}
                            loading="lazy"
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              p: 0.5,
                              borderTopLeftRadius: 4
                            }}
                          >
                            <ZoomInIcon fontSize="small" />
                          </Box>
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
        {/* Image Modal for viewing larger images */}
        <Modal
          open={imageModalOpen}
          onClose={handleCloseImageModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90%',
            maxHeight: '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <img 
              src={selectedImage} 
              alt="Certificate" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: 'calc(90vh - 100px)',
                objectFit: 'contain' 
              }} 
            />
            <Button 
              onClick={handleCloseImageModal} 
              sx={{ mt: 2 }}
              variant="contained"
            >
              Close
            </Button>
          </Box>
        </Modal>
        {/* Snackbar notifications */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={2000} 
          onClose={()=>{setSnackbarOpen(false)}}
          anchorOrigin={{ vertical: 'top', horizontal:'center' }}
        >
          <Alert 
            onClose={()=>{setSnackbarOpen(false)}}
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </Container>
    )

}