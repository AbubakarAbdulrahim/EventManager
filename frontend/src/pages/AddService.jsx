import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  InputAdornment,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import DrawerAppBar from '../components/DrawerAppBar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

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

const serviceTypes = [
  { value: 'venue', label: 'Venue' },
  { value: 'caterer', label: 'Caterer' },
  { value: 'decor', label: 'Decoration' },
  { value: 'photography', label: 'Photography' },
  { value: 'music', label: 'Music' },
];

const weekdays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];
  

const AddService = () => {
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [cuisineImages, setCuisineImages] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [availabilityRanges, setAvailabilityRanges] = useState([
    { 
      id: Date.now(),
      weekdays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      startTime: null,
      endTime: null
    }
  ]);

  // Base validation schema that applies to all service types
  const baseSchema = {
    type: Yup.string().required('Service type is required'),
    name: Yup.string().required('Service name is required'),
    location: Yup.string().required('Location is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive'),
    mainImage: Yup.mixed().required('Main image is required'),
    availability: Yup.array().of(
      Yup.object().shape({
        weekdays: Yup.object().test(
          'at-least-one-weekday',
          'At least one weekday must be selected',
          (weekdays) => Object.values(weekdays).some(day => day === true)
        ),
        startTime: Yup.date().nullable().required('Start time is required'),
        endTime: Yup.date().nullable().required('End time is required')
      })
    ).min(1, 'At least one availability period is required')
  };

  // Initial validation schema
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape(baseSchema)
  );

  // Update validation schema when service type changes
  useEffect(() => {
    let schemaFields = { ...baseSchema };

    switch (serviceType) {
      case 'venue':
        schemaFields = {
          ...schemaFields,
          capacity: Yup.number()
            .required('Capacity is required')
            .positive('Capacity must be positive')
            .integer('Capacity must be an integer'),
          venueType: Yup.string().required('Venue type is required'),
          additionalImages: Yup.array()
            .min(1, 'At least one additional venue image is required')
            .max(4, 'Maximum 4 additional images allowed')
        };
        break;
      case 'caterer':
        schemaFields = {
          ...schemaFields,
          numberOfPlates: Yup.number()
            .required('Number of plates is required')
            .positive('Number of plates must be positive')
            .integer('Number of plates must be an integer'),
          cuisineType: Yup.string().required('Cuisine type is required'),
          cuisineImages: Yup.array()
            .min(2, 'At least 2 cuisine images are required')
            .max(5, 'Maximum 5 cuisine images allowed')
        };
        break;
      case 'decor':
        schemaFields = {
          ...schemaFields,
          decorStyle: Yup.string().required('Decoration style is required'),
          setupTime: Yup.number()
            .required('Setup time is required')
            .positive('Setup time must be positive'),
        };
        break;
      case 'photography':
        schemaFields = {
          ...schemaFields,
          photographyClip: Yup.string().required('Photography clip is required'),
        };
        break;
      case 'music':
        schemaFields = {
          ...schemaFields,
          musicGenre: Yup.string().required('Music genre is required'),
        };
        break;
      default:
        break;
    }

    setValidationSchema(Yup.object().shape(schemaFields));
  }, [serviceType]);

  const formik = useFormik({
    initialValues: {
      type: '',
      name: '',
      location: '',
      price: '',
      mainImage: null,
      additionalImages: [],
      cuisineImages: [],
      availability: availabilityRanges,
      // Venue specific
      capacity: '',
      venueType: '',
      // Caterer specific
      numberOfPlates: '',
      cuisineType: '',
      // Decor specific
      decorStyle: '',
      setupTime: '',
      // Photography specific
      photographyClip: '',
      // Music specific
      musicGenre: '',
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      // Filter out fields that are not relevant to the selected service type
      const relevantFields = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== '' && values[key] !== null) {
          relevantFields[key] = values[key];
        }
      });
      
      // Create a new service object
      const newService = {
        id: Date.now(), // Simple ID generation
        ...relevantFields,
        mainImage: mainImagePreview || '/image1.jpg', // Use the preview URL or fallback
      };
      
      // Add additional images based on service type
      if (serviceType === 'venue' && additionalImages.length > 0) {
        newService.additionalImages = additionalImages.map(img => img.preview);
      }
      
      if (serviceType === 'caterer' && cuisineImages.length > 0) {
        newService.cuisineImages = cuisineImages.map(img => img.preview);
      }
      
      console.log('New Service:', newService);
      
      // Here you would typically send the data to your backend
      // For demo purposes, just show a success message
      setOpen(true);
      
      // Reset form
      formik.resetForm();
      setMainImage(null);
      setMainImagePreview('');
      setAdditionalImages([]);
      setCuisineImages([]);
      setServiceType('');
    },
  });


  const addAvailabilityRange = () => {
    const newRange = {
      id: Date.now(),
      weekdays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      startTime: null,
      endTime: null
    };
    const updated = [...availabilityRanges, newRange];
    setAvailabilityRanges(updated);
    formik.setFieldValue('availability', updated);
  };
  
  const removeAvailabilityRange = (rangeId) => {
    if (availabilityRanges.length > 1) {
      const updated = availabilityRanges.filter(range => range.id !== rangeId);
      setAvailabilityRanges(updated);
      formik.setFieldValue('availability', updated);
    }
  };
  const updateAvailabilityRange = (rangeId, field, value) => {
    const updatedRanges = availabilityRanges.map(range => {
      if (range.id === rangeId) {
        if (field.startsWith('weekdays.')) {
          const weekday = field.split('.')[1];
          return {
            ...range,
            weekdays: {
              ...range.weekdays,
              [weekday]: value
            }
          };
        }
        return { ...range, [field]: value };
      }
      return range;
    });
  
    setAvailabilityRanges(updatedRanges);
    formik.setFieldValue('availability', updatedRanges); // Sync with Formik
  };
  // Handle service type change
  const handleServiceTypeChange = (event) => {
    const newType = event.target.value;
    setServiceType(newType);
    formik.setFieldValue('type', newType);
    
    // Reset image arrays when changing service type
    setAdditionalImages([]);
    setCuisineImages([]);
    formik.setFieldValue('additionalImages', []);
    formik.setFieldValue('cuisineImages', []);
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainImage(file);
      formik.setFieldValue('mainImage', file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setMainImagePreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newImages = [];
      
      files.forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const imageObject = {
            file,
            preview: fileReader.result,
            id: Date.now() + Math.random() // Generate unique ID
          };
          
          newImages.push(imageObject);
          
          // If all files have been processed
          if (newImages.length === files.length) {
            const updatedImages = [...additionalImages, ...newImages];
            setAdditionalImages(updatedImages);
            formik.setFieldValue('additionalImages', updatedImages);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
  };

  const handleCuisineImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newImages = [];
      
      files.forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const imageObject = {
            file,
            preview: fileReader.result,
            id: Date.now() + Math.random() // Generate unique ID
          };
          
          newImages.push(imageObject);
          
          // If all files have been processed
          if (newImages.length === files.length) {
            const updatedImages = [...cuisineImages, ...newImages];
            setCuisineImages(updatedImages);
            formik.setFieldValue('cuisineImages', updatedImages);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (imageId) => {
    const updatedImages = additionalImages.filter(image => image.id !== imageId);
    setAdditionalImages(updatedImages);
    formik.setFieldValue('additionalImages', updatedImages);
  };

  const removeCuisineImage = (imageId) => {
    const updatedImages = cuisineImages.filter(image => image.id !== imageId);
    setCuisineImages(updatedImages);
    formik.setFieldValue('cuisineImages', updatedImages);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Function to render service-specific fields
  const renderServiceSpecificFields = () => {
    switch (serviceType) {
      case 'venue':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="capacity"
                label="Capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.venueType && Boolean(formik.errors.venueType)}>
                <InputLabel>Venue Type</InputLabel>
                <Select
                  name="venueType"
                  value={formik.values.venueType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Venue Type"
                >
                  <MenuItem value="indoor">Indoor</MenuItem>
                  <MenuItem value="outdoor">Outdoor</MenuItem>
                  <MenuItem value="mixed">Mixed (Indoor & Outdoor)</MenuItem>
                </Select>
                {formik.touched.venueType && formik.errors.venueType && (
                  <Typography color="error" variant="caption">
                    {formik.errors.venueType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Additional Venue Images (Add up to 4)
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={additionalImages.length >= 4}
                >
                  Add Venue Images
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImageChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  {additionalImages.length}/4 images
                </Typography>
              </Box>
              {formik.touched.additionalImages && formik.errors.additionalImages && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {formik.errors.additionalImages}
                </Typography>
              )}
              {additionalImages.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {additionalImages.map((image) => (
                    <Grid item xs={6} sm={3} key={image.id}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          sx={{
                            height: 100,
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                          src={image.preview}
                          alt="Venue preview"
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={() => removeAdditionalImage(image.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </>
        );
        
      case 'caterer':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="numberOfPlates"
                label="Number of Plates"
                type="number"
                value={formik.values.numberOfPlates}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numberOfPlates && Boolean(formik.errors.numberOfPlates)}
                helperText={formik.touched.numberOfPlates && formik.errors.numberOfPlates}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.cuisineType && Boolean(formik.errors.cuisineType)}>
                <InputLabel>Cuisine Type</InputLabel>
                <Select
                  name="cuisineType"
                  value={formik.values.cuisineType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Cuisine Type"
                >
                  <MenuItem value="local">Local</MenuItem>
                  <MenuItem value="continental">Continental</MenuItem>
                  <MenuItem value="chinese">Chinese</MenuItem>
                  <MenuItem value="indian">Indian</MenuItem>
                  <MenuItem value="mixed">Mixed Cuisines</MenuItem>
                </Select>
                {formik.touched.cuisineType && formik.errors.cuisineType && (
                  <Typography color="error" variant="caption">
                    {formik.errors.cuisineType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Cuisine Sample Images (Add 2-5 images)
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={cuisineImages.length >= 5}
                >
                  Add Cuisine Images
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleCuisineImageChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  {cuisineImages.length}/5 images
                </Typography>
              </Box>
              {formik.touched.cuisineImages && formik.errors.cuisineImages && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {formik.errors.cuisineImages}
                </Typography>
              )}
              {cuisineImages.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {cuisineImages.map((image) => (
                    <Grid item xs={6} sm={3} key={image.id}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          sx={{
                            height: 100,
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                          src={image.preview}
                          alt="Cuisine preview"
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                            },
                          }}
                          onClick={() => removeCuisineImage(image.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </>
        );
        
      case 'decor':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="decorStyle"
                label="Decoration Style"
                value={formik.values.decorStyle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.decorStyle && Boolean(formik.errors.decorStyle)}
                helperText={formik.touched.decorStyle && formik.errors.decorStyle}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="setupTime"
                label="Setup Time (hours)"
                type="number"
                value={formik.values.setupTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.setupTime && Boolean(formik.errors.setupTime)}
                helperText={formik.touched.setupTime && formik.errors.setupTime}
              />
            </Grid>
          </>
        );
        
      case 'photography':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="photographyClip"
                label="Photography Clip"
                value={formik.values.photographyClip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.photographyClip && Boolean(formik.errors.photographyClip)}
                helperText={formik.touched.photographyClip && formik.errors.photographyClip}
              />
            </Grid>
          </>
        );
        
      case 'music':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="musicGenre"
                label="Music Genre"
                value={formik.values.musicGenre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.musicGenre && Boolean(formik.errors.musicGenre)}
                helperText={formik.touched.musicGenre && formik.errors.musicGenre}
              />
            </Grid>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <DrawerAppBar/>
      <Container maxWidth="md" sx={{ mt: 5, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Add New Service
          </Typography>
          
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={handleServiceTypeChange}
                    onBlur={formik.handleBlur}
                    label="Service Type"
                  >
                    {serviceTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <Typography color="error" variant="caption">
                      {formik.errors.type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Service Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="price"
                  label="Price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                  }}
                />
              </Grid>

              {/* Render service-specific fields */}
              {renderServiceSpecificFields()}
              
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Main Service Image
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Main Image
                    <VisuallyHiddenInput 
                      type="file" 
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                  </Button>
                  
                  {formik.touched.mainImage && formik.errors.mainImage && (
                    <Typography color="error" variant="caption">
                      {formik.errors.mainImage}
                    </Typography>
                  )}
                  
                  {mainImagePreview && (
                    <Box
                      component="img"
                      sx={{
                        height: 200,
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        mt: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                      }}
                      src={mainImagePreview}
                      alt="Service preview"
                    />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
    {/* Availability Section */}
    <Grid item xs={12}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Service Availability
      </Typography>
      
      {availabilityRanges.map((range, index) => (
        <Grid item xs={12} key={range.id} sx={{ mb: 3 }}>
          {/* <Paper elevation={2} sx={{ p: 2 }}> */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              {availabilityRanges.length > 1 && (
                <IconButton 
                  onClick={() => removeAvailabilityRange(range.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              

              {/* Weekday Selection */}
              <Grid item xs={12}>
                <FormControl component="fieldset" error={!!formik.errors.availability?.[index]?.weekdays}>
                  <FormLabel component="legend">Available Days</FormLabel>
                  <FormGroup row>
                    {weekdays.map((day) => (
                      <FormControlLabel
                        key={day.value}
                        control={
                          <Checkbox
                            checked={range.weekdays[day.value]}
                            onChange={(e) => updateAvailabilityRange(
                              range.id,
                              `weekdays.${day.value}`,
                              e.target.checked
                            )}
                            name={day.value}
                          />
                        }
                        label={day.label}
                      />
                    ))}
                  </FormGroup>
                  {formik.errors.availability?.[index]?.weekdays && (
                    <Typography color="error" variant="caption">
                      {formik.errors.availability[index].weekdays}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Time Pickers */}
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Start Time"
                  value={range.startTime}
                  onChange={(newValue) => updateAvailabilityRange(range.id, 'startTime', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formik.errors.availability?.[index]?.startTime}
                      helperText={formik.errors.availability?.[index]?.startTime}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="End Time"
                  value={range.endTime}
                  onChange={(newValue) => updateAvailabilityRange(range.id, 'endTime', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formik.errors.availability?.[index]?.endTime}
                      helperText={formik.errors.availability?.[index]?.endTime}
                    />
                  )}
                />
              </Grid>
            </Grid>
          {/* </Paper> */}
        </Grid>
      ))}

      {/* <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addAvailabilityRange}
        fullWidth
        sx={{ mt: 2 }}
      >
        Add Another Availability Period
      </Button> */}
    </Grid>
  </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  size="large"
                >
                  Add Service
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Service added successfully!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default AddService;