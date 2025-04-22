import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import {
  Business,
  Email,
  LocationOn,
  Phone,
  Check,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import Checklist from '@mui/icons-material/Checklist';
import SuccessDialog from '../components/SuccessDialog';
import DrawerAppBar from '../components/DrawerAppBar';
import LabelBottomNavigation from '../components/LabelBottomNavigation';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

// Maximum file size (500KB)
const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes

// Styled component for file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: completed ? <Check /> : <PersonIcon />,
    2: completed ? <Check /> : <Business />,
    3: completed ? <Check /> : <AddIcon />,
    4: completed ? <Check /> : <Checklist />,
    5: <Check />
  };

  return (
    <Avatar
      sx={{
        width: 35,
        height: 35,
        bgcolor: completed || active ? '#033043' : 'grey.300',
        color: completed || active ? 'white' : 'grey.500',
        transition: 'all 0.3s ease'
      }}
    >
      {icons[icon]}
    </Avatar>
  );
};

// Define validation schemas for each step
const validationSchemas = {
  0: Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
  }),
  1: Yup.object({
    business_name: Yup.string().required('Business name is required'),
    address: Yup.string().required('Business address is required'),
    years_in_business: Yup.number().min(0, 'Cannot be negative'),
  }),
  2: Yup.object({
    certification_list: Yup.string().required('Please list your certifications'),
    }),
  3: Yup.object({
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
  }),
};

export default function VendorApplication() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [certificateFiles, setCertificateFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const steps = [
    { label: 'Personal Information', icon: 1 },
    { label: 'Business Details', icon: 2 },
    { label: 'Additional Information', icon: 3 },
    { label: 'Review & Submit', icon: 4 },
    { label: 'Submission Complete', icon: 5 }, // New success step
  ];

  const formik = useFormik({
    initialValues: {
      // Personal Information
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: '',
      
      // Business Information
      business_name: '',
      address: '',
      years_in_business: '',
      
      // Additional Info
      certification_list: '',
      
      
      // Terms & Conditions
      agreeToTerms: false
    },
    validationSchema: validationSchemas[activeStep],
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (activeStep === steps.length - 2) { // Check if it's the last step before success
        // Prepare form data for backend submission
        const formDataToSend = new FormData();
        
        // Add all form values to FormData
        Object.keys(values).forEach(key => {
          formDataToSend.append(key, values[key]);
        });
        
        // Add certificate files
        certificateFiles.forEach((file, index) => {
          formDataToSend.append(`certificate_${index}`, file);
        });
        
        // Log FormData for debugging
        console.log('Submitting form with data:', values);
        console.log('Files included:', certificateFiles);
        
        // Here you would send formDataToSend to your backend
        // axios.post('/api/vendor/application', formDataToSend)
        
        // Show final success step instead of dialog
        setSubmissionComplete(true);
        setOpenSuccess(true)
        setActiveStep(steps.length - 1);
      } else {
        // Move to next step after validation
        handleNext();
      }
    },
  });

  const handleCertificateUpload = (event) => {
    const files = Array.from(event.target.files);
    setFileError('');
    
    // Validate each file
    const validFiles = files.filter(file => {
      // Check file type
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setFileError('Only JPG, PNG, and PDF files are allowed');
        return false;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File "${file.name}" exceeds the 500KB size limit`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setCertificateFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setCertificateFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const errors = validateCurrentStep();
    if (Object.keys(errors).length === 0) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      // Set errors for display
      Object.keys(errors).forEach(field => {
        formik.setFieldTouched(field, true, false);
      });
      formik.setErrors(errors);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Validate the current step based on schema
  const validateCurrentStep = () => {
    try {
      validationSchemas[activeStep].validateSync(formik.values, { abortEarly: false });
      return {};
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
      }
      return validationErrors;
    }
  };

  // Generate readable file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render form content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Business Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Business Name"
                  name="business_name"
                  value={formik.values.business_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.business_name && Boolean(formik.errors.business_name)}
                  helperText={formik.touched.business_name && formik.errors.business_name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Business Address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Years in Business"
                  name="years_in_business"
                  type="number"
                  value={formik.values.years_in_business}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.years_in_business && Boolean(formik.errors.years_in_business)}
                  helperText={formik.touched.years_in_business && formik.errors.years_in_business}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={3}>
              
              
              
            <Grid item xs={12}>
                <TextField
                fullWidth
                label="List Your Certifications"
                name="certification_list"
                multiline
                rows={2}
                value={formik.values.certification_list}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.certification_list && Boolean(formik.errors.certification_list)}
                helperText={formik.touched.certification_list && formik.errors.certification_list}
                placeholder="Please list any relevant certifications or licenses you hold"
                />
            </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Certificates/Documents
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Select Files (Max 500KB each)
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleCertificateUpload}
                    multiple
                  />
                </Button>
                
                {fileError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {fileError}
                  </Alert>
                )}
                
                {certificateFiles.length > 0 && (
                  <List sx={{ bgcolor: 'background.paper' }}>
                    {certificateFiles.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemText 
                          primary={file.name} 
                          secondary={formatFileSize(file.size)} 
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  You can upload multiple files (business license, certifications, portfolio, etc.). Each file must be under 500KB.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Application
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Personal Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography>{formik.values.fullName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Email:</Typography>
                    <Typography>{formik.values.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Phone:</Typography>
                    <Typography>{formik.values.phone}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Business Details" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Business Name:</Typography>
                    <Typography>{formik.values.business_name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Business Address:</Typography>
                    <Typography>{formik.values.address}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Years in Business:</Typography>
                    <Typography>{formik.values.years_in_business || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader title="Additional Information" />
              <CardContent>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                      <Typography variant="subtitle2">Certifications:</Typography>
                      <Typography>{formik.values.certification_list}</Typography>
                </Grid>
                
                  {certificateFiles.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Uploaded Files:</Typography>
                      <List dense>
                        {certificateFiles.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemText 
                              primary={file.name} 
                              secondary={formatFileSize(file.size)} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    name="agreeToTerms"
                  />
                }
                label="I agree to the terms and conditions"
              />
              {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                <FormHelperText error>{formik.errors.agreeToTerms}</FormHelperText>
              )}
            </Box>
          </Box>
        );
      
      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              sx={{
                bgcolor: 'success.main',
                width: 80,
                height: 80,
                margin: '0 auto',
                mb: 3
              }}
            >
              <Check sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Typography variant="h4" gutterBottom>
              Application Submitted Successfully!
            </Typography>
            
            <Typography variant="body1" paragraph>
              Thank you for applying to become a vendor. We have received your application and will review it shortly.
            </Typography>
            
            <Typography variant="body1" paragraph>
              You will receive an email confirmation at {formik.values.email} with further instructions.
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              View Status
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <DrawerAppBar/>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Vendor Application
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Apply to become a vendor and start offering your services on our platform
          </Typography>
        </Box>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.slice(0, submissionComplete ? steps.length : steps.length - 1).map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={StepIcon}
                    StepIconProps={{
                      active: activeStep === index,
                      completed: activeStep > index,
                      icon: step.icon
                    }}
                  >{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Divider sx={{ mb: 4 }} />
            
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                {renderStepContent()}
                
                {activeStep < steps.length - 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Back
                    </Button>
                    
                    {activeStep === steps.length - 2 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Submit Application
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={formik.handleSubmit}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                )}
              </form>
            </FormikProvider>
          </CardContent>
        </Card>
        
        <SuccessDialog 
          open={openSuccess} 
          handleClose={(event, reason) => {
            if (reason === 'clickaway') return;
            setOpenSuccess(false);
          }} 
          title={'Application Submitted Successfully!'} 
          action={'View Status'} 
        />
      </Container>
      <LabelBottomNavigation/>
    </>
  );
}