import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  AddCircle,
  Checklist,
  CreditCard,
  ArrowBack
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#033043',
    },
  },
});

// Mock database data
const mockDB = {
  availableDates: [
    dayjs().add(2, 'day'),
    dayjs().add(3, 'day'),
    dayjs().add(5, 'day')
  ],
  availableTimeSlots: [
    '09:00',
    '11:00',
    '14:00',
    '16:00',
    '18:00'
  ],
  services: [
    { id: 1, name: 'Catering', price: 500 },
    { id: 2, name: 'Photography', price: 300 },
    { id: 3, name: 'Decorations', price: 400 },
    { id: 4, name: 'Audio/Visual', price: 600 },
  ]
};

const BookingProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [services, setServices] = useState([]);

  const steps = ['Select Date & Time', 'Additional Services', 'Review Details', 'Payment'];

  useEffect(() => {
    const fetchAvailability = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAvailableDates(mockDB.availableDates);
      setAvailableTimes(mockDB.availableTimeSlots);
      setServices(mockDB.services);
      setLoading(false);
    };
    
    fetchAvailability();
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleServiceSelect = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (service?.price || 0);
    }, 0);
  };

  const renderDateTimeSelection = () => {
    if (loading) {
      return <CircularProgress sx={{ color: '#033043' }} />;
    }

    return (
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <DatePicker
            label="Select Available Date"
            value={selectedDate}
            onChange={handleDateSelect}
            shouldDisableDate={(date) =>
              !availableDates.some(availableDate =>
                date.isSame(availableDate, 'day')
              )
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Available Time Slots
          </Typography>
          <Grid container spacing={2}>
            {availableTimes.map((time) => (
              <Grid item key={time}>
                <Button
                  variant={selectedTime === time ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTime(time)}
                  sx={{
                    bgcolor: selectedTime === time ? '#033043' : 'white',
                    color: selectedTime === time ? 'white' : '#033043',
                    borderColor: '#033043',
                    '&:hover': {
                      bgcolor: selectedTime === time ? '#022030' : '#f0f0f0'
                    }
                  }}
                >
                  {time}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderDateTimeSelection();
      case 1:
        return (
          <Grid container spacing={2}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} key={service.id}>
                <Card
                  onClick={() => handleServiceSelect(service.id)}
                  sx={{
                    border: selectedServices.includes(service.id) 
                      ? '2px solid #033043' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          sx={{ mr: 1 }}
                        />
                      }
                      label={`${service.name} - $${service.price}`}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <div>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>
            <Typography>
              Date: {selectedDate?.format('MMM D, YYYY')}<br />
              Time: {selectedTime}
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 2 }}>
              Selected Services
            </Typography>
            {selectedServices.map(id => {
              const service = services.find(s => s.id === id);
              return <Typography key={id}>- {service?.name}: ${service?.price}</Typography>;
            })}
            
            <Typography variant="h5" sx={{ mt: 2 }}>
              Total: ${calculateTotal()}
            </Typography>
          </div>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                value={paymentInfo.expiry}
                onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVC"
                value={paymentInfo.cvc}
                onChange={(e) => setPaymentInfo({...paymentInfo, cvc: e.target.value})}
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto', mt: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={StepperIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <div style={{ marginTop: '24px' }}>
            <div style={{ minHeight: 300, padding: '16px' }}>
              {getStepContent(activeStep)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                sx={{ color: '#033043' }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => alert('Booking Confirmed!')}
                  sx={{ bgcolor: '#033043', '&:hover': { bgcolor: '#022030' } }}
                >
                  Confirm & Pay
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!selectedDate || !selectedTime)) ||
                    (activeStep === 3 && Object.values(paymentInfo).some(v => !v))
                  }
                  sx={{ bgcolor: '#033043', '&:hover': { bgcolor: '#022030' } }}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </Paper>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const StepperIcon = ({ icon }) => {
  const icons = {
    1: <CalendarToday />,
    2: <AddCircle />,
    3: <Checklist />,
    4: <CreditCard />,
  };

  return (
    <Avatar sx={{ bgcolor: '#033043', color: 'white' }}>
      {icons[icon]}
    </Avatar>
  );
};

export default BookingProcess;