import React, { useState, useEffect,useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Avatar,
  Rating,
  InputAdornment
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {FormControl, InputLabel, Select, MenuItem, FormHelperText} from '@mui/material';
import {
  CalendarMonth,
  Schedule,
  Checklist,
  Check,
  Send,
  AttachMoney
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import {closePaymentModal } from 'flutterwave-react-v3';
import { useNotifications } from '../context/NotificationContext';

const StepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: <CalendarMonth />,
    2: <Schedule />,
    3: <AttachMoney />,
    4: <Checklist />,
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

// Helper function to calculate end time
  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationHours = parseFloat(duration);
    
    let endHours = hours + Math.floor(durationHours);
    const endMinutes = minutes + Math.round((durationHours % 1) * 60);
    
    if (endMinutes >= 60) {
      endHours += 1;
    }
    
    // Format to 24-hour time
    return `${(endHours % 24).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
  };

function BookingDialog({ open, handleClose, service, onConfirm, addBooking }) {
  const { user, authAxios } = useAuth();
  // State variables for pricing options
  const [selectedPricingModel, setSelectedPricingModel] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);
  const [days, setDays] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const { addNotification } = useNotifications();
  
  // Define steps for booking process
  const steps = [
    { label: 'Date', icon: 1 },
    { label: 'Time & Duration', icon: 2 },
    { label: 'Pricing', icon: 3 },
    { label: 'Review Details', icon: 4 },
  ];
  
  // State variables
  const [activeStep, setActiveStep] = useState(0);
  const [showCancelMsg, setShowCancelMsg] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState("");
  
  // Booking data state
  const [bookingData, setBookingData] = useState({
    date: null,
    time: '',
    duration: '',
    price: '',
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone_number || ''
  });
  
  // Available dates and time slots
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  // Loading states
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isSlotAvailable, setIsSlotAvailable] = useState(null);
  
  const fetchAvailableDates = () => {
    setLoadingDates(true);
  
    try {
      const data = service?.availability;
      if (!data) {
        setLoadingDates(false);
        return;
      }
      
      const datesSet = new Set();
  
      if (data.type === 'specific_date') {
        data.specificDates.forEach(({ date, is_booked }) => {
          if (is_booked) {
            datesSet.add(dayjs(date).format('YYYY-MM-DD'));
          }
        });
      } else if (data.type === 'recurring') {
        const start = dayjs(data.startDate).startOf('day');
        const end = dayjs(data.endDate).startOf('day');
  
        data.recurring.forEach(({ day_of_the_week, is_booked }) => {
          if (!is_booked) return;
  
          // Find first occurrence of the desired day_of_the_week
          let date = start.clone();
          while (date.day() !== day_of_the_week) {
            date = date.add(1, 'day');
          }
  
          // Add this weekday repeatedly until the end date
          while (date.isSame(end) || date.isBefore(end)) {
            datesSet.add(date.format('YYYY-MM-DD'));
            date = date.add(7, 'day'); // Jump by 7 days (same weekday)
          }
        });
      }
  
      const sortedDates = Array.from(datesSet).sort().map(date => dayjs(date));
      setAvailableDates(sortedDates);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoadingDates(false);
    }
  };
  
  // Calculate total price based on selected options - returns the value, doesn't set state
  const calculateTotalPrice = useMemo(() => {
  if (!selectedPricingModel || !selectedModel) return 0;
  
  switch (selectedPricingModel) {
    case 'hourly':
      return selectedModel.basePrice * duration;
    case 'itemBased':
      return selectedModel.basePrice
    case 'perDay':
      return selectedModel.basePrice * days;
    case 'perPlate':
    case 'perUnit':
    case 'perClip':
      return selectedModel.basePrice * quantity;
    case 'package':
      if (selectedPackage && selectedModel.packages) {
        console.log(selectedModel.packages);
        const packageDetails = selectedModel.packages.find(pkg => pkg.name === selectedPackage);
        return packageDetails?.price * quantity || 0;
      }
      return 0;
    case 'fixed':
      return selectedModel.basePrice;
    default:
      return 0;
  }
}, [selectedPricingModel, selectedModel, duration, days, quantity, selectedPackage]);
  
  // Update total price when relevant values change
  useEffect(() => {
    if (service && service.availability) {
      fetchAvailableDates();
    }
  }, [service]);
  
  useEffect(() => {
  if (selectedPricingModel && selectedModel) {
    const price = calculateTotalPrice;
    setTotalPrice(price);
    setBookingData(prev => ({ ...prev, price })); // Use calculated price directly
  }
}, [selectedPricingModel, selectedPackage, quantity, duration, days, selectedModel]);

  
  // Handle date selection
  const handleDateChange = useCallback((date) => {
  if (!date) return;
  
  // Clear previous time selection and availability status
  setBookingData(prev => ({ 
    ...prev, 
    date: date,
    time: '',
    duration: '' 
  }));
  setIsSlotAvailable(null);
  const data = service?.availability;
  
  if (data) {
    // Fetch available time slots for selected date
    fetchAvailableTimeSlots(date, data);
  }
}, [service?.availability]);
  
  const fetchAvailableTimeSlots = async (date, availabilityData) => {
    setLoadingTimeSlots(true);
    const selectedDate = date.format('YYYY-MM-DD');
    const selectedDay = date.day();
    let timeRange = null;
  
    // Find availability for selected day
    const specific = availabilityData.specificDates?.find(
      (entry) => entry.date === selectedDate && entry.is_booked
    );
  
    if (specific) {
      timeRange = { start: specific.start_time, end: specific.end_time };
    } else if (availabilityData.type === 'recurring') {
      const recurring = availabilityData.recurring?.find(
        (entry) => entry.day_of_the_week === selectedDay && entry.is_booked
      );
  
      if (recurring) {
        timeRange = { start: recurring.start_time, end: recurring.end_time };
      }
    }
  
    if (!timeRange) {
      setAvailableTimeSlots([]);
      setLoadingTimeSlots(false);
      return;
    }
  
    try {
      const res = await authAxios.get(`/bookings/booked-slot/${selectedDate}/`, {
        params: {
          service_id: service.id
        }}
      );
  
      const bookedSlots = res.data.booked_slots;
  
      const generateSlots = () => {
        const slots = [];
        const start = new Date(`1970-01-01T${timeRange.start}`);
        const end = new Date(`1970-01-01T${timeRange.end}`);
  
        while (start < end) {
          const slotTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
  
          // Check if slot overlaps with any booked slot
          const slotStart = new Date(start);
          const slotEnd = new Date(start.getTime() + 60 * 60000); // 1 hour
  
          const isOverlapping = bookedSlots.some(b => {
            const bStart = new Date(`1970-01-01T${b.start_time}`);
            const bEnd = new Date(`1970-01-01T${b.end_time}`);
            return slotStart < bEnd && slotEnd > bStart;
          });
  
          if (!isOverlapping) {
            slots.push(slotTime);
          }
  
          start.setMinutes(start.getMinutes() + 60); // hourly slot
        }
  
        return slots;
      };
  
      const finalSlots = generateSlots();
      setAvailableTimeSlots(finalSlots);
    } catch (error) {
      console.error('Failed to load booked slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };
  
  // Handle time slot selection
  const handleTimeSelect = (time) => {
    setBookingData(prev => ({ 
      ...prev, 
      time,
      duration: '' // Reset duration when time changes
    }));
    setIsSlotAvailable(null); // Reset availability check
  };
  
  // Handle duration change
  const handleDurationChange = (e) => {
    const duration = e.target.value;
    setBookingData(prev => ({ ...prev, duration }));
    setDuration(duration)
    
    // Only check availability if we have a selected time and valid duration
    if (bookingData.time && duration) {
      checkTimeSlotAvailability(bookingData.time, duration);
    } else {
      setIsSlotAvailable(null);
    }
  };
  
  const checkTimeSlotAvailability = async (time, duration) => {
    setCheckingAvailability(true);
    setError('');
  
    try {
      const formattedDate = dayjs(bookingData.date).format('YYYY-MM-DD');
      const selectedDay = bookingData.date.day();
      const availabilityData = service?.availability;
  
      // Step 1: Get working time range for this day
      let timeRange = null;
  
      const specific = availabilityData?.specificDates?.find(
        (entry) => entry.date === formattedDate && entry.is_booked
      );
  
      if (specific) {
        timeRange = { start: specific.start_time, end: specific.end_time };
      } else if (availabilityData?.type === 'recurring') {
        const recurring = availabilityData?.recurring?.find(
          (entry) => entry.day_of_the_week === selectedDay && entry.is_booked
        );
        if (recurring) {
          timeRange = { start: recurring.start_time, end: recurring.end_time };
        }
      }
  
      if (!timeRange) {
        setError('No working hours available for this date.');
        setIsSlotAvailable(false);
        setCheckingAvailability(false);
        return;
      }
  
      // Step 2: Validate that selected time + duration fits within allowed range
      const bookingStart = new Date(`1970-01-01T${time}`);
      const durationMinutes = parseFloat(duration) * 60;
      const bookingEnd = new Date(bookingStart.getTime() + durationMinutes * 60000);
  
      const rangeStart = new Date(`1970-01-01T${timeRange.start}`);
      const rangeEnd = new Date(`1970-01-01T${timeRange.end}`);
  
      if (bookingStart < rangeStart || bookingEnd > rangeEnd) {
        setError(`Selected time and duration exceed available hours (${timeRange.start} - ${timeRange.end}).`);
        setIsSlotAvailable(false);
        setCheckingAvailability(false);
        return;
      }
  
      // Step 3: Call backend to check against existing bookings
      const res = await authAxios.get(`/bookings/check-availability/`, {
        params: {
          date: formattedDate,
          start_time: time,
          duration: duration,
          service_id: service.id
        }
      });
  
      const available = res.data.available;
      setIsSlotAvailable(available);
  
      if (!available) {
        setError('This time slot is already booked or overlaps with an existing booking.');
      }
    } catch (error) {
      console.error('Error checking slot availability:', error);
      setError('Failed to check availability. Please try again.');
      setIsSlotAvailable(false);
    }
  
    setCheckingAvailability(false);
  };
  
  // Handler for pricing model selection
  const handlePricingModelChange = (event) => {
    const modelName = event.target.value;
    setSelectedPricingModel(modelName);
    
    // Find the selected model details
    const modelDetails = service?.priceModels?.find(model => model.model === modelName);
    setSelectedModel(modelDetails)
    
    // Reset other fields when model changes
    setSelectedPackage('');
    setSelectedPackageName('');
    
    // Validate the selection
    isPricingValid
  };
  
  // Handler for package selection
  const handlePackageChange = (event) => {
    const packageData = event.target.value;
    console.log(packageData);
    setSelectedPackage(packageData);
    
    // Find package name
    if (selectedModel?.packages) {
      const packageDetails = selectedModel.packages.find(pkg => pkg.name === packageData);
      setSelectedPackageName(packageDetails?.name || '');
    }
    
    isPricingValid
  };
  
  // Handler for quantity changes (plates, units, clips)
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setQuantity(value > 0 ? value : 1);
    isPricingValid
  };
  
  console.log(selectedPricingModel,
selectedModel,
selectedPackage,
selectedPackageName,
quantity, 
duration, 
days,
totalPrice,);
  
  
  // Handler for days changes
  const handleDaysChange = (event) => {
    const value = parseInt(event.target.value) || 0;
    setDays(value > 0 ? value : 1);
    isPricingValid
  };
  
  // Function to validate pricing fields
  const validatePricingFields = () => {
    const errors = {};
    
    if (!selectedPricingModel) {
      errors.pricingModel = 'Please select a pricing option';
    }
    
    if (selectedPricingModel === 'package' && !selectedPackage) {
      errors.package = 'Please select a package';
    }
    
    if (['perPlate', 'perUnit', 'perClip'].includes(selectedPricingModel) && (!quantity || quantity < 1)) {
      errors.quantity = 'Please enter a valid quantity';
    }
    
    if (selectedPricingModel === 'hourly' && (!duration || duration < 1)) {
      errors.duration = 'Please enter a valid duration';
    }
    
    if (selectedPricingModel === 'perDay' && (!days || days < 1)) {
      errors.days = 'Please enter a valid number of days';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isPricingValid = useMemo(() => {
  const errors = {};
    
    if (!selectedPricingModel) {
      errors.pricingModel = 'Please select a pricing option';
    }
    
    if (selectedPricingModel === 'package' && !selectedPackage) {
      errors.package = 'Please select a package';
    }
    
    if (['perPlate', 'perUnit', 'perClip'].includes(selectedPricingModel) && (!quantity || quantity < 1)) {
      errors.quantity = 'Please enter a valid quantity';
    }
    
    if (selectedPricingModel === 'hourly' && (!duration || duration < 1)) {
      errors.duration = 'Please enter a valid duration';
    }
    
    if (selectedPricingModel === 'perDay' && (!days || days < 1)) {
      errors.days = 'Please enter a valid number of days';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
}, [selectedPricingModel, selectedPackage, quantity, duration, days]);
  
  // Helper function to get friendly names for pricing models
  const getPricingModelName = (modelName) => {
    const modelNames = {
      'hourly': 'Hourly Rate',
      'perDay': 'Daily Rate',
      'perPlate': 'Per Plate',
      'perUnit': 'Per Unit',
      'perClip': 'Per Clip',
      'package': 'Package',
      'fixed': 'Fixed Price'
    };
    return modelNames[modelName] || modelName;
  };
  
  // Helper function to format prices
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '₦0';
    return `₦${price.toLocaleString()}`;
  };
  
  console.log(selectedPricingModel);
  // Handle submit review
  const handleSubmitReview = () => {
    console.log("Submitted review:", { rating: userRating, comment: reviewText });
    setOpenReview(false);
    setUserRating(0);
    setReviewText('');
  };
  
  // Flutterwave payment script loading
  let flutterwaveScriptLoading = null;
  const loadFlutterwaveScript = () => {
    if (window.FlutterwaveCheckout) return Promise.resolve();
  
    // If it's already loading, return the same promise
    if (flutterwaveScriptLoading) return flutterwaveScriptLoading;
  
    // Otherwise, start loading and store the promise
    flutterwaveScriptLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      script.onload = () => {
        resolve();
        flutterwaveScriptLoading = null; // optional: clear after load
      };
      script.onerror = (err) => {
        reject(err);
        flutterwaveScriptLoading = null; // reset if it fails
      };
      document.body.appendChild(script);
    });
  
    return flutterwaveScriptLoading;
  };
  
  const handlePayment = async () => {
  try {
    await loadFlutterwaveScript();
    setError('');
    window.FlutterwaveCheckout({
      public_key: import.meta.env.VITE_PUBLIC_KEY,
      tx_ref: Date.now(),
      amount: bookingData.price || totalPrice,
      currency: "NGN",
      payment_options: "card,ussd",
      customer: {
        email: bookingData.email,
        phone_number: bookingData.phone,
        name: bookingData.name,
      },
      callback: function (response) {
        console.log("Payment Response:", response);
        setShowCancelMsg(false);
        if (response.status === 'completed') {
          addNotification({
            type: 'success',
            message: 'Payment successful! Your booking has been confirmed.'
          });
          onConfirm({
            ...bookingData,
            date: bookingData.date?.format('YYYY-MM-DD'),
            service: service.name
          });
          addBooking(service);

          setTimeout(() => {
            console.log('hey im closing');
            closePaymentModal();
            // setOpenReview(true);
          }, 500);
        }
      },
      onclose: function () {
        console.log("User closed the payment modal.");
        setShowCancelMsg(true);
        addNotification({
          type: 'info',
          message: 'Payment was cancelled. Please try again to complete your booking.'
        });
      },
      customizations: {
        title: `Payment for Booking ${service.name}`,
        description: `Booking for ${service.name}`,
        logo: "http://localhost:5173/logo.png",
      },
    });
  } catch (e) {
    console.log(e);
    setError("Unable to load payment system. Please check your internet and try again.");
    addNotification({
      type: 'error',
      message: 'Unable to load payment system. Please check your internet and try again.'
    });
  }
};
  
  // Handle next step button
  const handleNext = (e) => {
    if (e) e.preventDefault();
    
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Final step - process payment
      handlePayment();
    }
  };
  
  // Handle back button
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  
  // Check if current step is valid to enable Next button
  const isStepValid = useMemo(() => {
  switch (activeStep) {
    case 0:
      return bookingData.date !== null;
    case 1:
      return bookingData.time && 
             bookingData.duration && 
             isSlotAvailable === true;
    case 2:
      return selectedPricingModel && isPricingValid; // Use memoized result
    case 3:
      return bookingData.name && 
             bookingData.email && 
             bookingData.phone;
    default:
      return false;
  }
}, [
  activeStep, 
  bookingData.date, 
  bookingData.time, 
  bookingData.duration, 
  isSlotAvailable, 
  selectedPricingModel, 
  isPricingValid, // Memoized validation result
  bookingData.name, 
  bookingData.email, 
  bookingData.phone
]);
  
  // Render the content for the current step
  const renderStepContent = (step) => {
    const serviceTitle = service?.name || 'Service';
    
    switch (step) {
      case 0: // Date selection
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Date for <strong>{serviceTitle}</strong>
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {loadingDates ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#033043' }} />
                </Box>
              ) : (
                <DateCalendar
                  value={bookingData.date}
                  onChange={handleDateChange}
                  shouldDisableDate={(date) => {
                    // Disable dates that are not in availableDates
                    return !availableDates.some(availDate => 
                      availDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                    );
                  }}
                  disablePast
                  sx={{
                    border: '1px solid #033043',
                    borderRadius: '8px',
                    '& .Mui-selected': {
                      backgroundColor: '#033043 !important'
                    }
                  }}
                />
              )}
            </LocalizationProvider>
            
            {bookingData.date && (
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  mt: 2, 
                  backgroundColor: '#e6f2f5', 
                  borderLeft: '4px solid #033043' 
                }}
              >
                <Typography variant="body1">
                  Selected Date: <strong>{bookingData.date.format('dddd, MMMM D, YYYY')}</strong>
                </Typography>
              </Paper>
            )}
          </Box>
        );

      case 1: // Time and duration selection
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Time & Duration for <strong>{serviceTitle}</strong> on {bookingData.date?.format('MMM D, YYYY')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select an available time slot, then specify the duration of your booking.
            </Typography>
            
            {loadingTimeSlots ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={24} sx={{ color: '#033043' }} />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((time) => (
                    <Grid item xs={4} key={time}>
                      <Button
                        variant={bookingData.time === time ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => handleTimeSelect(time)}
                        sx={{
                          backgroundColor: bookingData.time === time ? '#033043' : 'white',
                          color: bookingData.time === time ? 'white' : '#033043',
                          borderColor: '#033043',
                          '&:hover': {
                            backgroundColor: bookingData.time === time ? '#022030' : '#f0f0f0'
                          }
                        }}
                      >
                        {time}
                      </Button>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography color="error">
                      No available time slots for the selected date. Please select another date.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
            
            {bookingData.time && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Specify Duration (hours)
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Duration (hours)"
                      value={bookingData.duration}
                      onChange={handleDurationChange}
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, max: 8, step: 0.5 }
                      }}
                      error={!!error}
                      helperText={error || "Enter duration between 1-8 hours"}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    {checkingAvailability ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography>Checking availability...</Typography>
                      </Box>
                    ) : isSlotAvailable === true ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <Check sx={{ mr: 1 }} />
                        <Typography>Time slot available!</Typography>
                      </Box>
                    ) : isSlotAvailable === false ? (
                      <Typography color="error">
                        Time slot unavailable for the selected duration.
                      </Typography>
                    ) : null}
                  </Grid>
                </Grid>
                
                {bookingData.time && bookingData.duration && isSlotAvailable && (
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      mt: 3, 
                      backgroundColor: '#e6f7ee', 
                      borderLeft: '4px solid #2e7d32' 
                    }}
                  >
                    <Typography variant="body1">
                      Your booking: {bookingData.date?.format('MMM D, YYYY')} from {bookingData.time} for {bookingData.duration} hours
                      (until {calculateEndTime(bookingData.time, bookingData.duration)})
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </Box>
        );

      case 2: // Pricing options
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Pricing Options for <strong>{serviceTitle}</strong>
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose your preferred pricing model and specify any additional details.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors?.pricingModel}>
                  <InputLabel>Pricing Option</InputLabel>
                  <Select
                    value={selectedPricingModel}
                    onChange={handlePricingModelChange}
                    label="Pricing Option"
                  >
                    {service?.priceModels?.map((model, index) => (
                      <MenuItem value={model.model} key={index}>
                        {getPricingModelName(model.model)} - {formatPrice(model.basePrice)}
                        {model.model === 'hourly' && ' per hour'}
                        {model.model === 'perDay' && ' per day'}
                        {model.model === 'perPlate' && ' per plate'}
                        {model.model === 'perUnit' && ' per unit'}
                        {model.model === 'perClip' && ' per clip'}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors?.pricingModel && (
                    <FormHelperText>{formErrors.pricingModel}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Package Selection (if applicable) */}
              {selectedPricingModel === 'package' && selectedModel?.packages && selectedModel.packages.length > 0 && (
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!formErrors?.package}>
                    <InputLabel>Select Package</InputLabel>
                    <Select
                      value={selectedPackage}
                      onChange={handlePackageChange}
                      label="Select Package"
                    >
                      {selectedModel.packages.map((pkg, index) => {
                        console.log(pkg)
                        return(
                        <MenuItem value={pkg.name} key={index}>
                          {pkg.name} - {pkg.quantity_description} pieces for {formatPrice(pkg.price)}
                        </MenuItem>
                      )})}
                    </Select>
                    {formErrors?.package && (
                      <FormHelperText>{formErrors.package}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              
              {/* Quantity Input (for per-unit pricing) */}
              {['perPlate', 'perUnit', 'perClip', 'package'].includes(selectedPricingModel) && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={selectedPricingModel === 'perPlate' ? 'Number of Plates' : 
                           selectedPricingModel === 'perClip' ? 'Number of Clips' : 'Quantity'}
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1 }}
                    error={!!formErrors?.quantity}
                    helperText={formErrors?.quantity}
                  />
                </Grid>
              )}
              
              {/* Duration Input (for hourly pricing) */}
              {/* {selectedPricingModel === 'hourly' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (Hours)"
                    value={duration}
                    onChange={handleDuration}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Hours</InputAdornment>,
                      inputProps: { min: 1 }
                    }}
                    error={!!formErrors?.duration}
                    helperText={formErrors?.duration}
                  />
                </Grid>
              )} */}
              
              {/* Days Input (for daily pricing) */}
              {selectedPricingModel === 'perDay' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Days"
                    value={days}
                    onChange={handleDaysChange}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                      inputProps: { min: 1 }
                    }}
                    error={!!formErrors?.days}
                    helperText={formErrors?.days}
                  />
                </Grid>
              )}
              
              {/* Pricing Summary */}
              {selectedPricingModel && (
                <Grid item xs={12}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      mt: 1, 
                      backgroundColor: '#e6f2f5', 
                      borderLeft: '4px solid #033043' 
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Pricing Summary
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body1">
                        {selectedPackageName ? 
                          `Package: ${selectedPackageName}` :
                          `${getPricingModelName(selectedPricingModel)}`}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatPrice(calculateTotalPrice)}
                      </Typography>
                    </Box>
                    
                    {selectedPricingModel === 'hourly' && duration && (
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(selectedModel?.basePrice)} × {duration} hours
                      </Typography>
                    )}
                    
                    {selectedPricingModel === 'perDay' && days && (
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(selectedModel?.basePrice)} × {days} days
                      </Typography>
                    )}
                    
                    {['perPlate', 'perUnit', 'perClip'].includes(selectedPricingModel) && quantity && (
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(selectedModel?.basePrice)} × {quantity} {selectedPricingModel === 'perPlate' ? 'plates' : 
                                                                 selectedPricingModel === 'perClip' ? 'clips' : 'units'}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 3: // Review details
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Confirm Booking for <strong>{serviceTitle}</strong>
            </Typography>
            
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Date:</Typography>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    {bookingData.date?.format('dddd, MMMM D, YYYY')}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Time:</Typography>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    {bookingData.time} - {calculateEndTime(bookingData.time, bookingData.duration)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Duration:</Typography>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    {bookingData.duration} hours
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Pricing Option:</Typography>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    {getPricingModelName(selectedPricingModel)}
                    {selectedPricingModel === 'package' && selectedPackageName ? `: ${selectedPackageName}` : ''}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Price:</Typography>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    {formatPrice(bookingData.price || calculateTotalPrice)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Contact Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={bookingData.name}
                      onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                      margin="dense"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                      margin="dense"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                      margin="dense"
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            
            {showCancelMsg && (
              <Typography color="error">
                You cancelled the payment. Please try again to complete your booking.
              </Typography>
            )}
            
            {error && (
              <Typography color="error">
                ⚠️ {error}
              </Typography>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };
  
  
  
  // Helper function to calculate price based on duration
  const calculatePrice = (basePrice, duration) => {
    if (!basePrice || !duration) return 0;
    
    const price = basePrice * parseFloat(duration);
    return price;
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#033043', fontWeight: 600 }}>
          Book {service?.name || 'Service'}
        </DialogTitle>
        
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 3 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={StepIcon}
                  StepIconProps={{
                    active: activeStep === index,
                    completed: activeStep > index,
                    icon: step.icon
                  }}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: activeStep === index ? '#033043' : 'grey.600',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
        </DialogContent>
        
        <DialogActions sx={{ pb: 3, pr: 3 }}>
          {activeStep > 0 && (
            <Button 
              sx={{ color: "#033043" }} 
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          
          <Button 
            onClick={handleNext} 
            variant="contained" 
            sx={{ 
              backgroundColor: '#033043',
              '&:hover': { backgroundColor: '#022030' }
            }}
            disabled={!isStepValid}
          >
            {activeStep === steps.length - 1 ? 'Confirm & Pay' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openReview} 
        onClose={() => setOpenReview(false)} 
        maxWidth='sm'
      >
        <DialogTitle>Write a Review</DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography component="legend" sx={{ mr: 2 }}>Your Rating:</Typography>
            <Rating
              name="user-rating"
              value={userRating}
              onChange={(event, newValue) => {
                setUserRating(newValue);
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button 
            variant="contained"
            onClick={handleSubmitReview}
            disabled={!userRating || !reviewText.trim()}
            endIcon={<Send />}
            sx={{ 
              backgroundColor: '#033043',
              '&:hover': { backgroundColor: '#022030' }
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BookingDialog;