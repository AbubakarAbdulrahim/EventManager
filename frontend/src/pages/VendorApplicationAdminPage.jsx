import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  ImageList,
  ImageListItem,
  Modal
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import DrawerAppBar from '../components/DrawerAppBar';
import LabelBottomNavigation from '../components/LabelBottomNavigation';

// Mock data for vendor applications with the new data structure
const mockApplications = [
  {
    id: 1,
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '123-456-7890',
    business_name: 'Tech Solutions Inc.',
    address: '123 Main St, San Francisco, CA',
    years_in_business: '5',
    certification_list: 'Business License, ISO 9001, Tech Certification',
    certification_images: [
      './image1.jpg',
      './image1.jpg',
      './image1.jpg'
    ],
    status: 'pending',
    submittedDate: '2025-04-10',
  },
  {
    id: 2,
    fullName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '987-654-3210',
    business_name: 'Organic Foods Co.',
    address: '456 Elm St, Portland, OR',
    years_in_business: '3',
    certification_list: 'FDA Certification, Organic Products Certificate',
    certification_images: [
      './image1.jpg',
      './image1.jpg'
    ],
    status: 'pending',
    submittedDate: '2025-04-15',
  },
  {
    id: 3,
    fullName: 'Michael Wong',
    email: 'mwong@example.com',
    phone: '555-123-4567',
    business_name: 'Fashion Forward',
    address: '789 Oak Rd, New York, NY',
    years_in_business: '7',
    certification_list: 'Business Registration, Design Portfolio, Eco-Friendly Certification',
    certification_images: [
      './image1.jpg',
      './image1.jpg',
      './image1.jpg'
    ],
    status: 'pending',
    submittedDate: '2025-04-18',
  },
];

// Vendor roles options
const vendorRoles = [
  'Standard Vendor',
//   'Premium Vendor',
//   'Featured Vendor',
//   'Gold Partner',
//   'Silver Partner'
];

const VendorApplicationAdminPage = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRole, setSelectedRole] = useState('Standard Vendor');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
    setSelectedRole('Standard Vendor'); // Reset selected role
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleApprove = () => {
    if (selectedApplication) {
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'approved', role: selectedRole } 
          : app
      );
      
      setApplications(updatedApplications);
      setSnackbarMessage(`${selectedApplication.fullName}'s application approved as ${selectedRole}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  const handleReject = () => {
    if (selectedApplication) {
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'rejected' } 
          : app
      );
      
      setApplications(updatedApplications);
      setSnackbarMessage(`${selectedApplication.fullName}'s application rejected`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      handleCloseDialog();
    }
  };

  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>

    <DrawerAppBar/>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        Vendor Applications
      </Typography>
      
      {/* Search and filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, business or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Applications Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.fullName}</TableCell>
                  <TableCell>{application.business_name}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.submittedDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      color={
                        application.status === 'approved' ? 'success' :
                        application.status === 'rejected' ? 'error' : 'default'
                      }
                      size="small"
                    />
                    {application.role && (
                      <Chip 
                        label={application.role}
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewDetails(application)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No applications found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Application Details
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
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{height:'100%'}}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <Typography variant="body1"><strong>Name:</strong> {selectedApplication.fullName}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {selectedApplication.email}</Typography>
                    <Typography variant="body1"><strong>Phone:</strong> {selectedApplication.phone}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Business Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Business Information</Typography>
                    <Typography variant="body1"><strong>Business Name:</strong> {selectedApplication.business_name}</Typography>
                    <Typography variant="body1"><strong>Address:</strong> {selectedApplication.address}</Typography>
                    <Typography variant="body1"><strong>Years in Business:</strong> {selectedApplication.years_in_business}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {selectedApplication.status}</Typography>
                    <Typography variant="body1"><strong>Submitted:</strong> {selectedApplication.submittedDate}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Certification Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Certifications</Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Certification List:</strong> {selectedApplication.certification_list}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Certification Images:
                    </Typography>
                    
                    <ImageList cols={3} gap={16}>
                      {selectedApplication.certification_images.map((img, index) => (
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
                            src={img}
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
              
              {/* Assign Role (only for pending applications) */}
              {selectedApplication.status === 'pending' && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Assign Role</Typography>
                      <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Vendor Role</InputLabel>
                        <Select
                          value={selectedRole}
                          label="Vendor Role"
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          {vendorRoles.map((role) => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            {selectedApplication.status === 'pending' ? (
              <>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleReject} 
                  startIcon={<CloseIcon />}
                >
                  Reject Application
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleApprove} 
                  startIcon={<CheckIcon />}
                >
                  Approve as {selectedRole}
                </Button>
              </>
            ) : (
              <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>
            )}
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
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    <LabelBottomNavigation/>
    </>
  );
};

export default VendorApplicationAdminPage;