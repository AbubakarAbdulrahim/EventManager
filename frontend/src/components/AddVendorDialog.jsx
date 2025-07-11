import { useState } from "react";
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

export default function AddVendorDialog(dialogOpen, handleCloseDialog, selectedApplication, handleApprove, handleReject ) {
    console.log(selectedApplication)
    const [selectedRole, setSelectedRole] = useState('Standard Vendor');
    // Vendor roles options
    const vendorRoles = [
        'Standard Vendor',
    //   'Premium Vendor',
    //   'Featured Vendor',
    //   'Gold Partner',
    //   'Silver Partner'
    ];
  
    return(
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
    )
};
