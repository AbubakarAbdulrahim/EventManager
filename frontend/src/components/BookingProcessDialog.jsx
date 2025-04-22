import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogActions, Stepper, Step, StepLabel,
  MobileStepper, Grid, Button, Zoom, Slide, useTheme, CircularProgress,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import { useHotkeys } from 'react-hotkeys-hook';
import Confetti from 'react-confetti';
import dayjs from 'dayjs';

// --- Styled Components ---
const FabNext = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  borderRadius: '2rem',
  fontWeight: 600,
  transition: theme.transitions.create(['transform', 'opacity'], {
    duration: 300,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const TimeSlot = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  minWidth: 80,
  padding: theme.spacing(1),
  borderRadius: 12,
  border: '1px solid',
  borderColor: theme.palette.divider,
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 4,
    left: 4,
    height: 4,
    width: '80%',
    borderRadius: 2,
    background: theme.palette.success.light,
    animation: 'pulse 1.5s infinite ease-in-out',
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.6 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0.6 },
  },
}));

// --- Main Component ---
function BookingDialog({ open, handleClose, service, onConfirm, addBooking }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Keyboard nav
  useHotkeys('left', () => activeStep > 0 && setActiveStep(s => s - 1), [activeStep]);
  useHotkeys('right', () => activeStep < 2 && setActiveStep(s => s + 1), [activeStep]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleBooking = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addBooking({ service, date: selectedDate, time: selectedTime });
    onConfirm();
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      handleClose();
      setActiveStep(0);
    }, 2500);
  };

  // Step components
  const ServiceOverview = () => (
    <Zoom in timeout={300}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <img src={service.image} alt={service.name} style={{ width: '100%', borderRadius: 12 }} />
        </Grid>
        <Grid item xs={12}>
          <h2>{service.name}</h2>
          <p>{service.duration} min – ${service.price}</p>
        </Grid>
        <FabNext variant="contained" onClick={handleNext} aria-label="Next to time selection">Next</FabNext>
      </Grid>
    </Zoom>
  );

  const DateTimePicker = () => (
    <Slide direction="left" in timeout={300}>
      <Grid container spacing={2}>
        {/* 3-day carousel date picker (mocked with buttons) */}
        <Grid item xs={12}>
          <Grid container spacing={1} justifyContent="center">
            {[...Array(3)].map((_, i) => {
              const date = dayjs().add(i, 'day');
              return (
                <Button
                  key={i}
                  variant={selectedDate?.isSame(date, 'day') ? 'contained' : 'outlined'}
                  onClick={() => setSelectedDate(date)}
                  aria-label={`Select ${date.format('dddd')}`}
                >
                  {date.format('ddd D')}
                </Button>
              );
            })}
          </Grid>
        </Grid>

        {/* Time slots */}
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={1}>
            {loading ? (
              <CircularProgress />
            ) : (
              ['10:00', '10:15', '10:30', '11:00', '11:15'].map((time) => (
                <Grid item key={time}>
                  <TimeSlot
                    onClick={() => setSelectedTime(time)}
                    variant={selectedTime === time ? 'contained' : 'text'}
                    aria-label={`Select time ${time}`}
                  >
                    {time}
                  </TimeSlot>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth onClick={handleNext} variant="contained" disabled={!selectedDate || !selectedTime}>
            Continue
          </Button>
        </Grid>
      </Grid>
    </Slide>
  );

  const ConfirmationStep = () => (
    <Zoom in timeout={300}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <h2>Confirm Your Booking</h2>
          <p><strong>Service:</strong> {service.name}</p>
          <p><strong>Date:</strong> {selectedDate?.format('dddd, MMM D')}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleBooking}
            disabled={loading}
            aria-label="Confirm booking"
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
          </Button>
        </Grid>
      </Grid>
    </Zoom>
  );

  const steps = ['Service', 'Time Slot', 'Confirm'];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="booking-dialog-title">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent>
        {activeStep === 0 && <ServiceOverview />}
        {activeStep === 1 && <DateTimePicker />}
        {activeStep === 2 && <ConfirmationStep />}
      </DialogContent>

      <DialogActions>
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              Back
            </Button>
          }
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Next
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
}

BookingDialog.propTypes = {
  /**
   * Controls visibility of the dialog
   */
  open: PropTypes.bool.isRequired,
  /**
   * Callback to close the dialog
   */
  handleClose: PropTypes.func.isRequired,
  /**
   * The service to be booked
   */
  service: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    duration: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
  /**
   * Called on final confirmation click
   */
  onConfirm: PropTypes.func.isRequired,
  /**
   * Booking handler
   */
  addBooking: PropTypes.func.isRequired,
};

export default BookingDialog;
