import React, { useState, useEffect } from 'react';
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
  Rating
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
  CalendarMonth,
  Schedule,
  Checklist,
  Check,
  Send
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import {closePaymentModal } from 'flutterwave-react-v3';
import { useBookingContext } from '../context/BookingsContext';

const StepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: <CalendarMonth />,
    2: <Schedule />,
    3: <Checklist />,
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

function BookingDialog({ open, handleClose, service, onConfirm, addBooking }) {
  const { user } = useAuth();

  console.log(service);
  
  // Define steps for booking process
  const steps = [
    { label: 'Date', icon: 1 },
    { label: 'Time & Duration', icon: 2 },
    { label: 'Review Details', icon: 3 },
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
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user.phone_number
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
  
      const datesSet = new Set();
  
      if (data.type === 'specific_date') {
        data.specificDates.forEach(({ date, is_available }) => {
          if (is_available) {
            datesSet.add(dayjs(date).format('YYYY-MM-DD'));
          }
        });
      } else if (data.type === 'recurring') {
        const start = dayjs(data.startDate).startOf('day');
        const end = dayjs(data.endDate).startOf('day');
  
        data.recurring.forEach(({ day_of_the_week, is_available }) => {
          if (!is_available) return;
  
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
  
  
  useEffect(() => {
    fetchAvailableDates();
  }, [service]);
  // Handle date selection
  const handleDateChange = (date) => {
    if (!date) return;
    
    // Clear previous time selection and availability status
    setBookingData(prev => ({ 
      ...prev, 
      date: date,
      time: '',
      duration: '' 
    }));
    setIsSlotAvailable(null);
    const data =service?.availability
    console.log(data);
    // Fetch available time slots for selected date
    fetchAvailableTimeSlots(date, data);
  };
  
  // Mock function to fetch available time slots for a date
  const fetchAvailableTimeSlots = (date, availabilityData) => {
  setLoadingTimeSlots(true);

  setTimeout(() => {
    const selectedDate = date.format('YYYY-MM-DD');
    const selectedDay = date.day(); // 0 (Sun) to 6 (Sat)
    let timeRange = null;

    console.log('Fetching time slots for:', selectedDate);

    // Check for specific date availability
    const specific = availabilityData.specificDates?.find(
      (entry) => entry.date === selectedDate && entry.is_available
    );

    if (specific) {
      timeRange = { start: specific.start_time, end: specific.end_time };
    } else if (availabilityData.type === 'recurring') {
      // Check for recurring availability
      const recurring = availabilityData.recurring?.find(
        (entry) => entry.day_of_the_week === selectedDay && entry.is_available
      );

      console.log(recurring);

      if (recurring) {
        timeRange = { start: recurring.start_time, end: recurring.end_time };
      }
    }

    const slots = [];

    if (timeRange) {
      const [startHour, startMin] = timeRange.start.split(':').map(Number);
      const [endHour, endMin] = timeRange.end.split(':').map(Number);
      
      const start = new Date(`1970-01-01T${timeRange.start}`);
      const end = new Date(`1970-01-01T${timeRange.end}`);
      
      console.log(start, end);
      while (start < end) {
        const hour = String(start.getHours()).padStart(2, '0');
        const minute = String(start.getMinutes()).padStart(2, '0');
        slots.push(`${hour}:${minute}`);
        start.setMinutes(start.getMinutes() + 60); // hourly slots
      }
    }

    setAvailableTimeSlots(slots);
    setLoadingTimeSlots(false);
  }, 800);
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
    
    // Only check availability if we have a selected time and valid duration
    if (bookingData.time && duration) {
      checkTimeSlotAvailability(bookingData.time, duration);
    } else {
      setIsSlotAvailable(null);
    }
  };
  
  // Mock function to check if the time slot is available for the specified duration
  
const checkTimeSlotAvailability = (time, duration) => {
  setCheckingAvailability(true);
  setError('');

  // Simulated booked slots (replace this with actual API data)
  const bookedSlots = [
    { start: '10:00', end: '12:00' },
    { start: '14:00', end: '15:30' },
  ];

  setTimeout(() => {
    const [startHour, startMin] = time.split(':').map(Number);
    const durationMins = parseFloat(duration) * 60;
    
    const bookingStart = new Date(`1970-01-01T${time}`);
    const bookingEnd = new Date(bookingStart.getTime() + durationMins * 60000);

    let conflict = false;

    for (let slot of bookedSlots) {
      const slotStart = new Date(`1970-01-01T${slot.start}`);
      const slotEnd = new Date(`1970-01-01T${slot.end}`);

      if (bookingStart < slotEnd && bookingEnd > slotStart) {
        conflict = true;
        break;
      }
    }

    setIsSlotAvailable(!conflict);

    if (conflict) {
      setError('This time slot overlaps with an existing booking.');
    }

    setCheckingAvailability(false);
  }, 800);
};

  
  // Handle submit review
  const handleSubmitReview = () => {
    console.log("Submitted review:", { rating: userRating, comment: reviewText });
    setOpenReview(false);
    setUserRating(0);
    setReviewText('');
  };
  
  // Mock payment function
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
      setError('')
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-f26186bcd6a1340b7d354280b2605ad2-X",
      tx_ref: Date.now(),
      amount: calculatePrice(service?.basePrice, bookingData.duration),
      currency: "NGN",
      payment_options: "card,ussd",
      customer: {
        email: bookingData.email,
        phone_number: bookingData.phone,
        name: bookingData.name,
      },
      callback: function (response) {
        console.log("Payment Response:", response);
        // alert("Payment successful: " + response.tx_ref);
        setShowCancelMsg(false);
        response.status === 'completed' && (onConfirm({
          ...bookingData,
          date: bookingData.date?.format('YYYY-MM-DD'),
          service: service.name
        }), addBooking(service),
         
        setTimeout(() => {
          console.log('hey im closing')
          closePaymentModal();
          setOpenReview(true)
        }
        , 500)
      );
        // You can do something with the response here

        
      },
      onclose: function () {
        console.log("User closed the payment modal.");
        setShowCancelMsg(true);
      },
      customizations: {
        title: "Payment for Booking" ,
        description: `Booking for ${service.name}`,
        logo: "http://localhost:5173/logo.png",
      },
    });
  // } else {
  //   setError("Payment gateway failed to load. Please check your internet connection and try again.");
  //   console.error("FlutterwaveCheckout not loaded");
  // }
  // };
} catch (e) {
console.log(e);
  setError("Unable to load payment system. Please check your internet and try again.");
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
  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Date selection
        return bookingData.date !== null;
      case 1: // Time and duration
        return bookingData.time && 
               bookingData.duration && 
               isSlotAvailable === true; // Must be explicitly true, not just truthy
      case 2: // Review details
        return bookingData.name && 
               bookingData.email && 
               bookingData.phone;
      default:
        return false;
    }
  };
  
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

      case 2: // Review details
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
                  
                  <Typography variant="body2" color="text.secondary">Price:</Typography>
                  <Typography variant="body1" gutterBottom fontWeight="medium">
                    ₦{calculatePrice(service?.basePrice, bookingData.duration)}
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
            disabled={!isStepValid()}
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