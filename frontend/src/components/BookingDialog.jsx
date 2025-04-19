import React from 'react';
import { useState, useEffect } from 'react';
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
  Avatar
} from '@mui/material';
import {
  CalendarMonth,
  Checklist,
  Check,
  Schedule
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {closePaymentModal } from 'flutterwave-react-v3';
import { getAvailableDatesWithBookings, getAvailableTimeSlots, setIsBooked, availability } from '../services/availability';

const StepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: <CalendarMonth />,
    2: <Schedule />,
    3: <Checklist />,
    4: <Check />,
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
  const serviceData = service || {};
  const serviceTitle = serviceData.name || 'Service';
  const steps = [
    { label: 'Date', icon: 1 },
    { label: 'Time', icon: 2 },
    { label: 'Review Details', icon: 3 },
    { label: 'Confirmation', icon: 4 },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [showCancelMsg, setShowCancelMsg] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: null,
    time: '',
    name: '',
    email: '',
    phone: ''
  });
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [timeError, setTimeError] = useState(false);
  
  const b = availability.find(service => {
    // Check if the service ID matches
    if (service.serviceId === serviceData.id) {
      console.log(service.serviceId, serviceData.id)

      // Check if the date exists in the available dates
      // const availableDate = service.availableDates.find(d => d.date === bookingData.date?.format('YYYY-MM-DD'));
      // // Update the isBooked status of the existing time slot
      // if (availableDate) {
      //   service.availableDates.find(d => d.date === bookingData.date?.format('YYYY-MM-DD')).isBooked = true;
      // }
      console.log(service.availableDates.timeSlots.isBooked)
      return service.availableDates;
    }
  })

  console.log(b)
  useEffect(() => {
    if (open && service.id) {
      setLoadingDates(true);
      
      const sid = service.id.toString();
      // console.log(getAvailableTimeSlots(sid, ));
      // (getAvailableDatesWithBookings(sid).map(date => console.log(getAvailableTimeSlots(sid, date))));
      // console.log(getAvailableTimeSlots(service.id, bookingData.date?.format('YYYY-MM-DD')));
      // Get availability
      // const availability = mockDB.getServiceAvailability(service.id);
      setTimeout(() => {
          setAvailableDates(getAvailableDatesWithBookings(sid));
          // setAvailableTimes(getAvailableTimeSlots(sid, bookingData.date?.format('YYYY-MM-DD')));
        setLoadingDates(false);
      }, 1000);
    }
  }, [open, service.id ]);
  
  const handleDateChange = (date) => {
    if (!date) return;
    if (!service.id) return;
    
    setLoadingTimes(true);
    setBookingData(prev => ({ ...prev, date: date }));
    const sid = service.id.toString();
    // Get available times for the selected date
    const selectedDate = date.format('YYYY-MM-DD');
    console.log('Selected date:', selectedDate);
    var availableTimes;
    if(getAvailableTimeSlots(sid, selectedDate).length === 0) {
      setTimeError(true);
      availableTimes = ['Not Available'];
    } else {
      setTimeError(false);
      availableTimes = getAvailableTimeSlots(sid, selectedDate);
    }
    // const availableTimes = getAvailableTimeSlots(sid, selectedDate).length !== 0 ? getAvailableTimeSlots(sid, selectedDate) : ['Not Available'];
    console.log('Available times:', availableTimes);
    
    
    setTimeout(() => {
      setAvailableTimes(availableTimes);
      setLoadingTimes(false);
    }, 500);
  };

  const handleTimeSelect = (time) => {
    setBookingData(prev => ({ ...prev, time }));
  };

  const handlePayment = () => {
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-f26186bcd6a1340b7d354280b2605ad2-X",
      tx_ref: Date.now(),
      amount: service.price,
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
          service: serviceTitle
        }), addBooking(serviceData),
         setIsBooked((service.id).toString(),
        bookingData.date?.format('YYYY-MM-DD'), bookingData.time),
        setTimeout(() => {
          closePaymentModal();
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
        description: `Booking for ${serviceTitle}`,
        logo: "http://localhost:5173/logo.png",
      },
    });
  };
  

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handlePayment()
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDetailChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
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
                  shouldDisableDate={(date) => 
                    !availableDates.some(availableDate => 
                      date.isSame(availableDate, 'day'))
                  }
                  sx={{
                    border: '1px solid #033043',
                    borderRadius: '8px',
                    '& .Mui-selected': {
                      backgroundColor: '#033043 !important'
                    }
                  }}
                  disabled={loadingDates}
                />
              )}
            </LocalizationProvider>
          </Box>
        );

      case 1:    
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Time for <strong>{serviceTitle}</strong> on {bookingData.date?.format('MMM D, YYYY')}
            </Typography>
            {loadingTimes ? (
              <CircularProgress size={24} sx={{ color: '#033043' }} />
            ) : (
              <Grid container spacing={2}>
                {availableTimes.map((time) => (
                  <Grid item xs={4} key={time}>
                    <Button
                      variant={bookingData.time === time ? 'contained' : 'outlined'}
                      fullWidth
                      disabled={timeError}
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
                ))}
              </Grid>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Enter Your Details
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={bookingData.name}
              onChange={handleDetailChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={bookingData.email}
              onChange={handleDetailChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={bookingData.phone}
              onChange={handleDetailChange}
            />
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Confirm Booking for <strong>{serviceTitle}</strong>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2">Date:</Typography>
                <Typography>{bookingData.date?.format('MMM D, YYYY')}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">Time:</Typography>
                <Typography>{bookingData.time}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">Price:</Typography>
                <Typography>₦{service.price}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="body2">Contact Details:</Typography>
                <Typography>{bookingData.name}</Typography>
                <Typography>{bookingData.email}</Typography>
                <Typography>{bookingData.phone}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
              {showCancelMsg && (
                <Typography style={{ color: "red" }}>You cancelled the payment.</Typography>
              )}
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#033043', fontWeight: 600 }}>
        Book {serviceTitle}
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
          <Button sx={{ color: "#033043" }} onClick={handleBack}>
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
          disabled={
            (activeStep === 0 && !bookingData.date) ||
            (activeStep === 1 && !bookingData.time) ||
            (activeStep === 2 && (!bookingData.name || !bookingData.email || !bookingData.phone))
          }
        >
          {activeStep === steps.length - 1 ? 'Confirm & Pay' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BookingDialog;


