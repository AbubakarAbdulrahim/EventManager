import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
  Box,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

import { useAuth } from '../../context/AuthContext';

// Service types and their specific fields
const SERVICE_TYPES = {
  VENUE: 'venue',
  CATERER: 'caterer',
  PHOTOGRAPHY: 'photography',
  MUSIC: 'music',
  DECORATION: 'decoration',
};

// Specific fields based on service type
const SERVICE_SPECIFIC_FIELDS = {
  [SERVICE_TYPES.VENUE]: [
    { name: 'capacity', label: 'Maximum Capacity', type: 'number' },
    { name: 'venueType', label: 'Venue Type', type: 'select', options: [
      { value: 'hall', label: 'Hall' },
      { value: 'garden', label: 'Garden' },
      { value: 'beachfront', label: 'Beachfront' },
      { value: 'rooftop', label: 'Rooftop' },
      { value: 'hotel', label: 'Hotel' },
    ]},
    { name: 'amenities', label: 'Amenities', type: 'chips' },
  ],
  [SERVICE_TYPES.CATERER]: [
    { name: 'cuisineType', label: 'Cuisine Type', type: 'select', options: [
      { value: 'italian', label: 'Italian' },
      { value: 'indian', label: 'Indian' },
      { value: 'chinese', label: 'Chinese' },
      { value: 'american', label: 'American' },
      { value: 'mexican', label: 'Mexican' },
    ]},
    { name: 'maxPlates', label: 'Maximum Number of Plates', type: 'number' },
    { name: 'dietaryOptions', label: 'Dietary Options Available', type: 'chips' },
  ],
  [SERVICE_TYPES.PHOTOGRAPHY]: [
    { name: 'maxClips', label: 'Maximum Number of Clips/Photos', type: 'number' },
    { name: 'equipmentDetails', label: 'Equipment Details', type: 'text' },
    { name: 'style', label: 'Photography Style', type: 'select', options: [
      { value: 'documentary', label: 'Documentary' },
      { value: 'portrait', label: 'Portrait' },
      { value: 'artistic', label: 'Artistic' },
      { value: 'traditional', label: 'Traditional' },
    ]},
  ],
  [SERVICE_TYPES.MUSIC]: [
    { name: 'genre', label: 'Music Genre', type: 'select', options: [
      { value: 'rock', label: 'Rock' },
      { value: 'jazz', label: 'Jazz' },
      { value: 'classical', label: 'Classical' },
      { value: 'pop', label: 'Pop' },
      { value: 'electronic', label: 'Electronic' },
    ]},
    { name: 'groupSize', label: 'Group Size', type: 'number' },
    { name: 'instruments', label: 'Instruments', type: 'chips' },
  ],
  [SERVICE_TYPES.DECORATION]: [
    { name: 'decorStyle', label: 'Decoration Style', type: 'select', options: [
      { value: 'modern', label: 'Modern' },
      { value: 'vintage', label: 'Vintage' },
      { value: 'rustic', label: 'Rustic' },
      { value: 'elegant', label: 'Elegant' },
      { value: 'themed', label: 'Themed' },
    ]},
    { name: 'materials', label: 'Materials Used', type: 'chips' },
    { name: 'setupTime', label: 'Setup Time Required (hours)', type: 'number' },
  ],
};

// Pricing models based on service type
const PRICING_MODELS = {
  [SERVICE_TYPES.VENUE]: [
    { value: 'hourly', label: 'Per Hour' },
    { value: 'daily', label: 'Per Day' },
    { value: 'event', label: 'Per Event' },
  ],
  [SERVICE_TYPES.CATERER]: [
    { value: 'perPlate', label: 'Per Plate' },
    { value: 'package', label: 'Package Based' },
    { value: 'custom', label: 'Custom Quote' },
  ],
  [SERVICE_TYPES.PHOTOGRAPHY]: [
    { value: 'hourly', label: 'Per Hour' },
    { value: 'perClip', label: 'Per Clip/Photo' },
    { value: 'package', label: 'Package Based' },
  ],
  [SERVICE_TYPES.MUSIC]: [
    { value: 'hourly', label: 'Per Hour' },
    { value: 'event', label: 'Per Event' },
    { value: 'performance', label: 'Per Performance' },
  ],
  [SERVICE_TYPES.DECORATION]: [
    { value: 'package', label: 'Package Based' },
    { value: 'itemBased', label: 'Item Based' },
    { value: 'custom', label: 'Custom Quote' },
  ],
};

// Days of the week for recurring availability
const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

// Main component
const AddServiceDialog = ({ open, onClose }) => {
  const {authAxios} = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [chipInputs, setChipInputs] = useState({});
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newChip, setNewChip] = useState({});
  
  // State for new features
  const [pricingModels, setPricingModels] = useState([]);
  const [availabilityType, setAvailabilityType] = useState('dateRange');
  const [recurringAvailability, setRecurringAvailability] = useState([]);
  const [newRecurringSlot, setNewRecurringSlot] = useState({
    day: null,
    startTime: null,
    endTime: null,
  });
  const [specificDateSlots, setSpecificDateSlots] = useState([]);

  // Steps for the stepper
  const steps = ['Basic Information', 'Service Details', 'Pricing', 'Availability', 'Images'];

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      serviceType: '',
      serviceName: '',
      description: '',
      location: '',
      mainImage: null,
      additionalImages: [],
      availabilityStartDate: null,
      availabilityEndDate: null,
    },
    validationSchema: Yup.object().shape({
      serviceType: Yup.string().required('Service type is required'),
      serviceName: Yup.string().required('Service name is required'),
      description: Yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
      location: Yup.string().required('Location is required'),
      mainImage: Yup.mixed().required('Main image is required'),
      availabilityStartDate: Yup.date().nullable().required('Start date is required'),
      availabilityEndDate: Yup.date().nullable()
        .required('End date is required')
        .min(Yup.ref('availabilityStartDate'), 'End date must be after start date'),
    }),
    onSubmit: async (values) => {

      const formattedData = formatDataForBackend(values);
      // const formDataToSend = new FormData();
      


      // Object.keys(formattedData).forEach(key => {
      //   if (Array.isArray(formattedData[key])) {
      //     formattedData[key].forEach((item, index) => {
      //       if (typeof item === 'object') {
      //         Object.keys(item).forEach(subKey => {
      //           formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
      //         });
      //       } else {
      //         formDataToSend.append(`${key}[${index}]`, item);
      //       }
      //     });
      //   }
      //   else if (typeof formattedData[key] === 'object') {
      //     Object.keys(formattedData[key]).forEach(subKey => {
      //       formDataToSend.append(`${key}[${subKey}]`, formattedData[key][subKey]);
      //     });
      //   } else {
      //     formDataToSend.append(key, formattedData[key]);
      //   }
      // });
      console.log(formattedData, 'formattedData');

      // const buildFormData = (formattedData) => {
      //   const formData = new FormData();
      
      //   const appendNested = (key, value) => {
      //     if (value === null || value === undefined) return;
      
      //     if (Array.isArray(value)) {
      //       value.forEach((item, i) => {
      //         appendNested(`${key}[${i}]`, item);
      //       });
      //     } else if (typeof value === "object" && !(value instanceof File)) {
      //       Object.entries(value).forEach(([k, v]) => {
      //         appendNested(`${key}[${k}]`, v);
      //       });
      //     } else {
      //       formData.append(key, value);
      //     }
      //   };
      
      //   // Go through all keys
      //   Object.entries(formattedData).forEach(([key, value]) => {
      //     if (key === "service_images") {
      //       // handle separately below
      //       return;
      //     }
      
      //     appendNested(key, value);
      //   });
      
      //   // Handle service_images separately to preserve image + is_main
      //   formattedData.service_images.forEach((imgObj, i) => {
      //     if (imgObj.image) {
      //       formData.append(`service_images[${i}][image]`, imgObj.image); // File object
      //     }
      //     formData.append(`service_images[${i}][is_main]`, imgObj.is_main);
      //   });
      
      //   return formData;
      // };
      


      // const formDataToSend = buildFormData(formattedData);

      // for(const pairs of formDataToSend.entries()) {
      //   console.log(pairs[0] + ', ' + pairs[1]);
      // }
      
      try {
        setIsSubmitting(true);
        
        // Format data according to backend structure
        
        const response = await authAxios.post('/vendors/services/create/', formattedData)
        if (response.status === 201) {
          console.log('Service created successfully:', response.data);
        } else {
          console.error('Error creating service:', response.data);
        }
        

        console.log('Submitting service data:', formattedData);
        
        
        
        setIsSubmitting(false);
        // onClose();
        // Reset form
        // formik.resetForm();
        // setActiveStep(0);
        // setPricingModels([]);
        // setRecurringAvailability([]);
        // setSpecificDateSlots([]);
        // setMainImagePreview(null);
        // setAdditionalImagesPreviews([]);
        // setAvailabilityType('dateRange');
      } catch (error) {
        setIsSubmitting(false);
        console.error('Error submitting service:', error);
      }
    }
  });

  // Format data for backend submission
  const formatDataForBackend = (values) => {
    // Format images
    const images = [];
    
    // Add main image
    if (mainImagePreview) {
      images.push({
        image: mainImagePreview,
        is_main: true
      });
    }
    
    // Add additional images
    if (additionalImagesPreviews && additionalImagesPreviews.length > 0) {
      additionalImagesPreviews.forEach(img => {
        images.push({
          image: img,
          is_main: false
        });
      });
    }
    
    // Format specific date availability
    const specificDates = specificDateSlots.map(slot => ({
      date: slot.date ? dayjs(slot.date).format('YYYY-MM-DD') : '',
      start_time: slot.startTime ? dayjs(slot.startTime).format('HH:mm') : '',
      end_time: slot.endTime ? dayjs(slot.endTime).format('HH:mm') : ''
    }));
    
    // Format recurring availability
    const recurringSlots = recurringAvailability.map(slot => ({
      day_of_the_week: slot.day !== null ? slot.day : '',
      start_time: slot.startTime ? dayjs(slot.startTime).format('HH:mm') : '',
      end_time: slot.endTime ? dayjs(slot.endTime).format('HH:mm') : ''
    }));
    
    // Format pricing models
    const pricingData = pricingModels.map(model => {
      const pricing = {
        model_type: model.model,
        base_price: model.basePrice || '',
      };
      
      // Add packages if available
      if (model.packages && model.packages.length > 0) {
        pricing.price_packages = model.packages.map(pkg => ({
          name: pkg.name || '',
          description: pkg.description || '',
          price: pkg.price || '',
          quantity_description: pkg.quantity || ''
        }));
      } else {
        pricing.price_packages = [];
      }
      
      return pricing;
    });
    
    // Get service specific data
    const serviceSpecificData = {};
    if (values.serviceType) {
      const specificFields = SERVICE_SPECIFIC_FIELDS[values.serviceType] || [];
      specificFields.forEach(field => {
        if (values[field.name] !== undefined) {
          serviceSpecificData[field.name] = values[field.name];
        }
      });
    }

    console.log(values)

    const amenities = (values.amenities || values.instruments || values.dietaryOptions).map(item => ({
      name: item || '',
    }));
    
    
    // Combine all data
    return {
      service_name: values.serviceName,
      service_type: values.serviceType,
      location: values.location,
      description: values.description,
      availability_start_date: values.availabilityStartDate ? dayjs(values.availabilityStartDate).format('YYYY-MM-DD') : '',
      availability_end_date: values.availabilityEndDate ? dayjs(values.availabilityEndDate).format('YYYY-MM-DD') : '',
      availability_type: availabilityType,
      specific_date_availability: specificDates,
      recurring_availability: recurringSlots,
      service_images: images,
      pricing: pricingData,
      // Include any service-specific fields
      ...serviceSpecificData,
      amenities: amenities,
      service_quantity: serviceSpecificData.maxPlates || serviceSpecificData.maxClips || serviceSpecificData.capacity || '',
      service_mode: serviceSpecificData.venueType || serviceSpecificData.cuisineType || serviceSpecificData.style || serviceSpecificData.genre || serviceSpecificData.decorStyle || '',
    };
  };

  // Add dynamic validation based on service type
  useEffect(() => {
    if (formik.values.serviceType) {
      const specificFields = SERVICE_SPECIFIC_FIELDS[formik.values.serviceType] || [];
      
      // Add dynamic fields to formik values
      specificFields.forEach(field => {
        if (!formik.values.hasOwnProperty(field.name)) {
          formik.setFieldValue(field.name, field.type === 'chips' ? [] : '', false);
        }
      });
    }
  }, [formik.values.serviceType]);

  // Handle main image upload
  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    formik.setFieldValue('mainImage', file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setMainImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle additional images upload
  const handleAdditionalImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    // Limit to 5 additional images
    const newFiles = files.slice(0, 5 - formik.values.additionalImages.length);
    formik.setFieldValue('additionalImages', [...formik.values.additionalImages, ...newFiles]);
    
    // Create previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setAdditionalImagesPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove an additional image
  const removeAdditionalImage = (index) => {
    const updatedImages = [...formik.values.additionalImages];
    updatedImages.splice(index, 1);
    formik.setFieldValue('additionalImages', updatedImages);
    
    const updatedPreviews = [...additionalImagesPreviews];
    updatedPreviews.splice(index, 1);
    setAdditionalImagesPreviews(updatedPreviews);
  };

  // Add a new chip (for chip inputs)
  const handleAddChip = (fieldName) => {
    if (newChip[fieldName] && newChip[fieldName].trim() !== '') {
      const currentValues = formik.values[fieldName] || [];
      formik.setFieldValue(fieldName, [...currentValues, newChip[fieldName]]);
      setNewChip({...newChip, [fieldName]: ''});
    }
  };

  // Remove a chip
  const handleRemoveChip = (fieldName, index) => {
    const currentValues = [...formik.values[fieldName]];
    currentValues.splice(index, 1);
    formik.setFieldValue(fieldName, currentValues);
  };

  // Handle next step in stepper
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle back step in stepper
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Add pricing model
  const addPricingModel = () => {
    setPricingModels([...pricingModels, { 
      model: '', 
      basePrice: '',
      packages: [] 
    }]);
  };

  // Update pricing model
  const updatePricingModel = (index, field, value) => {
    const updatedModels = [...pricingModels];
    updatedModels[index] = { ...updatedModels[index], [field]: value };
    setPricingModels(updatedModels);
  };

  // Remove pricing model
  const removePricingModel = (index) => {
    setPricingModels(pricingModels.filter((_, i) => i !== index));
  };

  // Add package to pricing model
  const addPackage = (modelIndex) => {
    const updatedModels = [...pricingModels];
    updatedModels[modelIndex].packages = [
      ...updatedModels[modelIndex].packages, 
      { name: '', description: '', price: '', quantity: '' }
    ];
    setPricingModels(updatedModels);
  };

  // Update package in pricing model
  const updatePackage = (modelIndex, packageIndex, field, value) => {
    const updatedModels = [...pricingModels];
    updatedModels[modelIndex].packages[packageIndex] = { 
      ...updatedModels[modelIndex].packages[packageIndex], 
      [field]: value 
    };
    setPricingModels(updatedModels);
  };

  // Remove package from pricing model
  const removePackage = (modelIndex, packageIndex) => {
    const updatedModels = [...pricingModels];
    updatedModels[modelIndex].packages = updatedModels[modelIndex].packages.filter((_, i) => i !== packageIndex);
    setPricingModels(updatedModels);
  };

  // Add recurring availability
  const addRecurringAvailability = () => {
    if (!newRecurringSlot.day || !newRecurringSlot.startTime || !newRecurringSlot.endTime) return;
    
    setRecurringAvailability([...recurringAvailability, { ...newRecurringSlot }]);
    setNewRecurringSlot({ day: null, startTime: null, endTime: null });
  };

  // Remove recurring availability
  const removeRecurringAvailability = (index) => {
    setRecurringAvailability(recurringAvailability.filter((_, i) => i !== index));
  };

  // Add specific date slot
  const addSpecificDateSlot = () => {
    setSpecificDateSlots([...specificDateSlots, { 
      date: null, 
      startTime: null, 
      endTime: null 
    }]);
  };

  // Update specific date slot
  const updateSpecificDateSlot = (index, field, value) => {
    const updatedSlots = [...specificDateSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setSpecificDateSlots(updatedSlots);
  };

  // Remove specific date slot
  const removeSpecificDateSlot = (index) => {
    setSpecificDateSlots(specificDateSlots.filter((_, i) => i !== index));
  };

  // Check if current step is valid
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Basic Information
        return formik.values.serviceType && 
               !formik.errors.serviceType && 
               formik.values.serviceName && 
               !formik.errors.serviceName && 
               formik.values.description && 
               !formik.errors.description &&
               formik.values.location &&
               !formik.errors.location;
      case 1: // Service Details
        // Check if all required service-specific fields are filled
        const specificFields = SERVICE_SPECIFIC_FIELDS[formik.values.serviceType] || [];
        return specificFields.every(field => {
          if (field.type === 'chips') return true; // Chips are optional
          return formik.values[field.name] && !formik.errors[field.name];
        });
      case 2: // Pricing
        return pricingModels.length > 0 && pricingModels.every(model => {
          if (!model.model) return false;
          if (model.model === 'custom') return true;
          if (model.model === 'package') {
            return model.packages.length > 0 && model.packages.every(pkg => pkg.name && pkg.price);
          }
          return !!model.basePrice;
        });
      case 3: // Availability
        return formik.values.availabilityStartDate && formik.values.availabilityEndDate &&
              !formik.errors.availabilityStartDate && !formik.errors.availabilityEndDate &&
              (availabilityType === 'dateRange' || 
               (availabilityType === 'recurring' && recurringAvailability.length > 0) ||
               (availabilityType === 'specific_date' && specificDateSlots.length > 0));
      case 4: // Images
        return formik.values.mainImage && !formik.errors.mainImage;
      default:
        return true;
    }
  };

  // Render service specific fields
  const renderServiceSpecificFields = () => {
    if (!formik.values.serviceType) return null;
    
    const specificFields = SERVICE_SPECIFIC_FIELDS[formik.values.serviceType] || [];
    
    return specificFields.map(field => {
      switch (field.type) {
        case 'select':
          return (
            <FormControl 
              fullWidth 
              margin="normal"
              key={field.name}
              error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
            >
              <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
              <Select
                labelId={`${field.name}-label`}
                id={field.name}
                name={field.name}
                value={formik.values[field.name] || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label={field.label}
              >
                {field.options.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched[field.name] && formik.errors[field.name] && (
                <FormHelperText>{formik.errors[field.name]}</FormHelperText>
              )}
            </FormControl>
          );
        case 'chips':
          return (
            <Box key={field.name} sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1">{field.label}</Typography>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs>
                  <TextField
                    fullWidth
                    placeholder={`Add ${field.label}`}
                    value={newChip[field.name] || ''}
                    onChange={(e) => setNewChip({...newChip, [field.name]: e.target.value})}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChip(field.name);
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleAddChip(field.name)}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {(formik.values[field.name] || []).map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveChip(field.name, index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          );
        default:
          return (
            <TextField
              key={field.name}
              fullWidth
              margin="normal"
              id={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={formik.values[field.name] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
              helperText={formik.touched[field.name] && formik.errors[field.name]}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          );
      }
    });
  };

  // Render pricing form
  const renderPricingModels = () => {
    if (!formik.values.serviceType) return null;
    
    return (
      <>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addPricingModel}
          sx={{ mt: 2, mb: 2 }}
        >
          Add Pricing Model
        </Button>
        
        {pricingModels.map((model, modelIndex) => (
          <Paper key={modelIndex} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Pricing Model</InputLabel>
                  <Select
                    value={model.model}
                    onChange={(e) => updatePricingModel(modelIndex, 'model', e.target.value)}
                    label="Pricing Model"
                  >
                    {PRICING_MODELS[formik.values.serviceType]?.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {model.model && model.model !== 'package' && model.model !== 'custom' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Base Price"
                    type="number"
                    value={model.basePrice}
                    onChange={(e) => updatePricingModel(modelIndex, 'basePrice', e.target.value)}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
              )}
              
              {model.model === 'package' && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addPackage(modelIndex)}
                    sx={{ mb: 2 }}
                  >
                    Add Package
                  </Button>
                  
                  {model.packages.map((pkg, pkgIndex) => (
                    <Paper key={pkgIndex} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Package Name"
                            value={pkg.name}
                            onChange={(e) => updatePackage(modelIndex, pkgIndex, 'name', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={pkg.price}
                            onChange={(e) => updatePackage(modelIndex, pkgIndex, 'price', e.target.value)}
                            InputProps={{
                              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                              inputProps: { min: 0 }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Quantity/Units"
                            type="number"
                            value={pkg.quantity}
                            onChange={(e) => updatePackage(modelIndex, pkgIndex, 'quantity', e.target.value)}
                            placeholder="e.g., 100 plates, 4 hours"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                            value={pkg.description}
                            onChange={(e) => updatePackage(modelIndex, pkgIndex, 'description', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                          <IconButton 
                            color="error" 
                            onClick={() => removePackage(modelIndex, pkgIndex)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>
              )}
              
              {model.model === 'custom' && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Customers will request a custom quote. You'll provide pricing upon request.
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <IconButton 
                  color="error" 
                  onClick={() => removePricingModel(modelIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </>
    );
  };
  
  // Render availability options
  const renderAvailabilityOptions = () => {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Availability Start Date"
                value={formik.values.availabilityStartDate}
                onChange={(newDate) => formik.setFieldValue('availabilityStartDate', newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.availabilityStartDate && Boolean(formik.errors.availabilityStartDate),
                    helperText: formik.touched.availabilityStartDate && formik.errors.availabilityStartDate
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Availability End Date"
                value={formik.values.availabilityEndDate}
                onChange={(newDate) => formik.setFieldValue('availabilityEndDate', newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.availabilityEndDate && Boolean(formik.errors.availabilityEndDate),
                    helperText: formik.touched.availabilityEndDate && formik.errors.availabilityEndDate
                  }
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Availability Pattern
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={<Switch 
                checked={availabilityType === 'recurring'} 
                onChange={() => setAvailabilityType('recurring')} 
              />}
              label="Recurring Weekly Schedule"
            />
            <FormControlLabel
              control={<Switch 
                checked={availabilityType === 'specific_date'} 
                onChange={() => setAvailabilityType('specific_date')}
              />}
              label="Specific Dates and Times"
            />
          </FormGroup>
        </FormControl>
      
        {availabilityType === 'recurring' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recurring Weekly Availability
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      value={newRecurringSlot.day !== null ? newRecurringSlot.day : ''}
                      onChange={(e) => setNewRecurringSlot({...newRecurringSlot, day: e.target.value})}
                      label="Day of Week"
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={12} sm={3}>
                    <TimePicker
                      label="Start Time"
                      value={newRecurringSlot.startTime}
                      onChange={(newTime) => setNewRecurringSlot({...newRecurringSlot, startTime: newTime})}
                      slotProps={{ textField: {

  fullWidth: true
}
}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TimePicker
                      label="End Time"
                      value={newRecurringSlot.endTime}
                      onChange={(newTime) => setNewRecurringSlot({...newRecurringSlot, endTime: newTime})}
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </Grid>
                </LocalizationProvider>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={addRecurringAvailability}
                    startIcon={<AddIcon />}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            {recurringAvailability.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Weekly Schedule:
                </Typography>
                {recurringAvailability.map((slot, index) => (
                  <Paper key={index} sx={{ p: 1, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>
                      {DAYS_OF_WEEK.find(d => d.value === slot.day)?.label} - 
                      {dayjs(slot.startTime).format(' h:mm A')} to 
                      {dayjs(slot.endTime).format(' h:mm A')}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => removeRecurringAvailability(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}
        
        {availabilityType === 'specific_date' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Specific Date and Time Slots
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addSpecificDateSlot}
              sx={{ mb: 2 }}
            >
              Add Date Slot
            </Button>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {specificDateSlots.map((slot, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        label="Date"
                        value={slot.date}
                        onChange={(newDate) => updateSpecificDateSlot(index, 'date', newDate)}
                        slotProps={{
                          textField: {
                            fullWidth: true
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TimePicker
                        label="Start Time"
                        value={slot.startTime}
                        onChange={(newTime) => updateSpecificDateSlot(index, 'startTime', newTime)}
                        slotProps={{
                          textField: {
                            fullWidth: true
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TimePicker
                        label="End Time"
                        value={slot.endTime}
                        onChange={(newTime) => updateSpecificDateSlot(index, 'endTime', newTime)}
                        slotProps={{
                          textField: {
                            fullWidth: true
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton color="error" onClick={() => removeSpecificDateSlot(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </LocalizationProvider>
          </Box>
        )}
      </>
    );
  };

  // Render image upload section
  const renderImageUpload = () => {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom>
          Main Service Image
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload Main Image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleMainImageUpload}
            />
          </Button>
          
          {mainImagePreview && (
            <Box sx={{ mt: 2, position: 'relative' }}>
              <img src={mainImagePreview} alt="Main Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
            </Box>
          )}
          
          {formik.touched.mainImage && formik.errors.mainImage && (
            <Typography color="error" variant="caption">
              {formik.errors.mainImage}
            </Typography>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Additional Images (Optional)
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
            disabled={formik.values.additionalImages.length >= 5}
          >
            Upload Additional Images
            <input
              hidden
              accept="image/*"
              type="file"
              multiple
              onChange={handleAdditionalImagesUpload}
            />
          </Button>
          
          <Typography variant="caption" color="textSecondary" sx={{ mb: 2 }}>
            Up to 5 additional images (optional)
          </Typography>
          
          <Grid container spacing={2}>
            {additionalImagesPreviews.map((preview, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ position: 'relative' }}>
                  <img src={preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'rgba(255,255,255,0.7)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={() => removeAdditionalImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  };

  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <FormControl
              fullWidth
              margin="normal"
              error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
            >
              <InputLabel id="service-type-label">Service Type</InputLabel>
              <Select
                labelId="service-type-label"
                id="serviceType"
                name="serviceType"
                value={formik.values.serviceType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Service Type"
              >
                <MenuItem value={SERVICE_TYPES.VENUE}>Venue</MenuItem>
                <MenuItem value={SERVICE_TYPES.CATERER}>Caterer</MenuItem>
                <MenuItem value={SERVICE_TYPES.PHOTOGRAPHY}>Photography</MenuItem>
                <MenuItem value={SERVICE_TYPES.MUSIC}>Music</MenuItem>
                <MenuItem value={SERVICE_TYPES.DECORATION}>Decoration</MenuItem>
              </Select>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <FormHelperText>{formik.errors.serviceType}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              id="serviceName"
              name="serviceName"
              label="Service Name"
              value={formik.values.serviceName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
              helperText={formik.touched.serviceName && formik.errors.serviceName}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            
            <TextField
              fullWidth
              margin="normal"
              id="location"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              InputProps={{
                startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </>
        );
      case 1:
        return renderServiceSpecificFields();
      case 2:
        return renderPricingModels();
      case 3:
        return renderAvailabilityOptions();  
      case 4:
        return renderImageUpload();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle variant='h5'>
        Add New Service
      </DialogTitle>
      
      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions>
        {/* <Button variant='outlined' onClick={onClose} color="inherit">
          Close
        </Button> */}
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={isSubmitting}>
            Back
          </Button>
        )}
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleNext}
          disabled={!isStepValid() || isSubmitting}
          endIcon={activeStep === steps.length - 1 && isSubmitting ? <CircularProgress size={20} /> : null }
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;