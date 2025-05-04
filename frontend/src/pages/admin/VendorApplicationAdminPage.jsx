import React, { useState, useEffect, use } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import DrawerAppBar from '../../components/DrawerAppBar';
import LabelBottomNavigation from '../../components/LabelBottomNavigation';


// Vendor roles options
const vendorRoles = [
  'Standard Vendor',
//   'Premium Vendor',
//   'Featured Vendor',
//   'Gold Partner',
//   'Silver Partner'
];

const VendorApplicationAdminPage = () => {
  const [applications, setApplications] = useState([]);
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
  const {authAxios} = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ACTIONS = {
    approve: { message: "approved as vendor", status: "approved", severity: "success" },
    reject: { message: "application rejected", status: "rejected", severity: "error" },
    suspend: { message: "suspended", status: "suspended", severity: "warning" },
    activate: { message: "activated", status: "approved", severity: "success" },
  };

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async ()=>{
        try{
          const response = await authAxios.get('/vendors/')
          console.log(response);
          const transformed = response.data.map(app => {
            console.log(app);
            return ({
              id: app.id,
              fullName: app.user.full_name,
              email: app.user.email,
              phone: app.user.phone_number,
              business_name: app.business_name,
              address: app.address,
              years_in_business: String(app.years_in_business),
              certification_list: app.certification_list,
              certification_images: app.certification_images,
              status: app.status,
              submittedDate: app.created_at.split('T')[0],
            })
          })
          setApplications(transformed);
          setLoading(false);
        } catch(err){
          setError(err);
          setLoading(false);
        } 
    }

    fetchData()
      
        
  }, []);





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

  const handleAction = async (app, action) => {
    const { message, status, severity } = ACTIONS[action] || {};
    if (!message) {
      console.error('Unknown action:', action);
      return;
    }

    try {
      const response = await authAxios.post(`api-admin/vendors/${app.id}/suspend-activate/`, { action });
      console.log(response);
      if (response.status === 200) {
        const updatedApplications = applications.map(a =>
          a.id === app.id ? { ...a, status } : a
        );
        setApplications(updatedApplications);
  
        if (selectedApplication?.id === app.id) {
          setSelectedApplication({ ...app, status });
        }
  
        setSnackbarMessage(`${app.fullName} has been ${message}`);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setSnackbarMessage('Error updating application status');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleCloseDialog?.();

  }

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

    {/* <DrawerAppBar/> */}
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.id}</TableCell>
                  <TableCell>{application.fullName}</TableCell>
                  <TableCell>{application.business_name}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.submittedDate}</TableCell>
                  <TableCell sx={{display:'flex', gap:1}}>
                    <Chip 
                      label={application.status}
                      color={
                        application.status === 'approved' ? 'success' :
                        application.status === 'rejected' ? 'error' : 'default'
                      }
                      size="small"
                    />
                    {application.role && (
                      <Chip 
                        label={(application.role).split(' ')[0]}
                        color="primary"
                        size="small"
                        // sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => handleViewDetails(application)}>View</Button>
                    {application.status === 'pending' ? (
                      <>
                        <Button size="small" variant="outlined" color="success" onClick={()=>{handleAction(application, 'approve')}} >Approve</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleAction(application, 'reject')} >Reject</Button>
                      </>
                    ) : (['approved', 'suspended'].includes(application.status) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color={application.status === 'suspended' ? 'success' : 'error'}
                        onClick={() => handleAction(application, application.status === 'suspended' ? 'activate' : 'suspend')}
                      >
                        {application.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </Button>
                    )
                    )}
                  </Box>
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
                  onClick={() => handleReject(selectedApplication)}
                  startIcon={<CloseIcon />}
                >
                  Reject Application
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={()=>{handleApprove(selectedApplication, selectedRole)}} 
                  startIcon={<CheckIcon />}
                >
                  Approve as {selectedRole}
                </Button>
              </>
            ) : (['approved', 'suspended'].includes(selectedApplication.status) && (
              <>
              <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>
              <Button
                size="small"
                variant="outlined"
                color={selectedApplication.status === 'suspended' ? 'success' : 'error'}
                onClick={() => handleToggleSuspend(selectedApplication)}
              >
                {selectedApplication.status === 'suspended' ? 'Activate' : 'Suspend'}
              </Button>
              
              </>
              )
            )
            || 
            <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>}
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
        anchorOrigin={{ vertical: 'top', horizontal:'center' }}
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
    </>
  );
};

export default VendorApplicationAdminPage;