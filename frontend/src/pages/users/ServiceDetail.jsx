import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Modal} from '@mui/material';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Rating,
  TextField,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tab,
  Tabs,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import {
  LocationOn,
  DateRange,
  AccessTime,
  Star,
  Phone,
  Email,
  Language,
  CheckCircle,
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  Send
} from '@mui/icons-material';
import { mockServices } from '../../services/mockServices';
import { useServiceContext } from '../../context/ServiceContext';
import { useBookingContext } from '../../context/BookingsContext';
import BookingDialog from '../../components/BookingDialog';
import SuccessDialog from '../../components/SuccessDialog';
// Fake data for demonstration
const serviceData = {
  id: "101",
  name: "Grand Pavilion",
  category: "Venue",
  description: "An elegant venue perfect for weddings, corporate events, and celebrations of all kinds. Our Grand Pavilion offers panoramic views, state-of-the-art facilities, and flexible spaces to accommodate events of any size.",
  longDescription: "The Grand Pavilion is nestled in the heart of the city with easy access from major highways. Our beautifully landscaped gardens and spacious indoor halls provide the perfect backdrop for your special occasion. With over 15 years of experience, we've hosted thousands of successful events ranging from intimate gatherings to grand celebrations.",
  price: "$2,500 - $5,000",
  rating: 4.7,
  reviewCount: 153,
  images: [
    "/api/placeholder/800/500",
    "/api/placeholder/800/500",
    "/api/placeholder/800/500",
    "/api/placeholder/800/500"
  ],
  features: [
    "Capacity: Up to 500 guests",
    "Indoor and outdoor spaces available",
    "In-house sound system",
    "Customizable lighting",
    "Free parking for 200 cars",
    "Wheelchair accessible",
    "Bridal suite and green rooms"
  ],
  availability: [
    { date: "2025-05-01", slots: ["Morning", "Evening"] },
    { date: "2025-05-02", slots: ["Morning"] },
    { date: "2025-05-03", slots: ["Afternoon", "Evening"] },
    { date: "2025-05-04", slots: ["Morning", "Afternoon", "Evening"] },
    { date: "2025-05-05", slots: ["Morning", "Afternoon"] }
  ],
  location: {
    address: "123 Event Boulevard, New York, NY 10001",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  provider: {
    name: "Elite Event Spaces Inc.",
    description: "Elite Event Spaces has been in the event industry for over two decades, providing exceptional venues and services for all types of celebrations. Our experienced team works closely with clients to ensure every detail is perfect.",
    logo: "/api/placeholder/100/100",
    contactInfo: {
      phone: "+1 (555) 123-4567",
      email: "bookings@eliteeventspaces.com",
      website: "www.eliteeventspaces.com"
    },
    established: 2005,
    otherServices: ["Catering", "Decoration", "Event Planning"]
  },
  reviews: [
    {
      id: 1,
      user: "Jennifer Smith",
      avatar: "/api/placeholder/50/50",
      rating: 5,
      date: "2025-03-15",
      comment: "We had our wedding at Grand Pavilion and everything was absolutely perfect! The staff was professional and attentive to every detail."
    },
    {
      id: 2,
      user: "Robert Johnson",
      avatar: "/api/placeholder/50/50",
      rating: 4,
      date: "2025-02-28",
      comment: "Great venue for our corporate event. The audiovisual setup was excellent and our guests loved the ambiance."
    },
    {
      id: 3,
      user: "Michelle Davis",
      avatar: "/api/placeholder/50/50",
      rating: 5,
      date: "2025-01-10",
      comment: "Hosted my daughter's sweet sixteen here and it was a dream come true. Beautiful space with excellent service!"
    }
  ]
};

const ServiceDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const { id } = useParams();
  const service = mockServices.find((s) => s.id.toString() === id);
  const {isFavorite, addToFavorites, removeFromFavorites} = useServiceContext();
  const {isBooked, addBooking, cancelBooking} = useBookingContext();
  const booked = isBooked(service.id);
  const favorite = isFavorite(service.id);
  const features = [service.capacity, service.location, service.type]
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState("");


  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  function addFavorite(e){
    e.preventDefault();
    if(favorite) removeFromFavorites(service.id)
    else addToFavorites(service)
}

  const handleBookingDialogOpen = () => {
    setOpenBookingDialog(true);
  };

  const handleBookingDialogClose = () => {
    setOpenBookingDialog(false);
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };
  const handleBookService = (service) => {
    setBookings([...bookings, service.id]);
    setSelectedService("")
    setOpenSuccess(true);
    setOpenBookingDialog(false)
  };
  const handleConfirmBooking = () => {
    handleBookService(selectedService);
};

  // Close the booking dialog and reset selected service
  const handleCloseBooking = () => {
    setSelectedService('')
    setBookingOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSuccess(false);
    // handleClose();
  };
  const handleCancelBooking = (serviceId) => {
    setBookings(bookings.filter(id => id !== serviceId));
  };
  function addBookings(e){
    e.preventDefault();
    if(booked) {cancelBooking(service.id); handleCancelBooking(service.id)}
    else handleBookNow(service);
  }


  const handleBookingSubmit = () => {
    // In a real app, you would send booking information to your backend
    console.log("Booking submitted:", { serviceId: serviceData.id, date: selectedDate, slot: selectedSlot });
    handleBookingDialogClose();
    // Show success message or redirect to confirmation page
  };
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        sx={{ mb: 2 }}
        onClick={() => window.history.back()}
      >
        Back
      </Button>

      {/* Service Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {service.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={service.type} 
              color="primary" 
              size="small" 
              sx={{ mr: 1 }} 
            />
            <Rating 
              value={service.rating} 
              precision={0.1} 
              readOnly 
              size="small" 
              sx={{ mr: 1 }} 
            />
            <Typography variant="body2" color="text.secondary">
              {/* ({service.reviewCount} reviews) */}
              (189 reviews)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {service.location}
            </Typography>
          </Box>
        </Box>
        <Box>
        <IconButton
            onClick={(e) => addFavorite && addFavorite(e)}
            color={favorite ? "error" : "default"}
          >
            {favorite ? <Favorite sx={{color:'#ef4444'}}/> : <FavoriteBorder sx={{color:'#033043'}}/>}
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Image Gallery */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={service.image}
              alt={service.name}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={1}>
            {/* {service.image.map((image, index) => ( */}
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    border:  '2px solid #033043',
                    opacity:  1 ,
                    transition: 'all 0.2s'
                  }}
                  // onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={service.image}
                    alt={`${service.name} view`}
                    onClick={()=> handleOpenImage(service.image)}
                  />
                </Card>
              </Grid>
            {/* ))} */}
          </Grid>
          {/* Price and Booking Button */}
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ₦{service.price}
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={addBookings}
            >
              {booked ? 'Cancel Booking' : 'Book Now'}
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="service details tabs">
          <Tab label="Description" id="tab-0" />
          <Tab label="Features" id="tab-1" />
          <Tab label="Availability" id="tab-2" />
          <Tab label="Reviews" id="tab-3" />
          <Tab label="Location" id="tab-4" />
          <Tab label="Provider" id="tab-5" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ mb: 4 }}>
        {/* Description Tab */}
        <Box role="tabpanel" hidden={tabValue !== 0}>
          {tabValue === 0 && (
            <Typography variant="body1" paragraph>
              {/* {service.additional_info} */}
              {service.name}
            </Typography>
          )}
        </Box>

        {/* Features Tab */}
        <Box role="tabpanel" hidden={tabValue !== 1}>
          {tabValue === 1 && (
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      height: '100%'
                    }}
                  >
                    <CheckCircle color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">{feature}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Availability Tab */}
        <Box role="tabpanel" hidden={tabValue !== 2}>
          {tabValue === 2 && (
            <Grid container spacing={2}>
              {/* {service.availability.map((day, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateRange color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {day.slots.map((slot, slotIndex) => (
                        <Box key={slotIndex} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">{slot}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))} */}
              <Typography>No availability data found</Typography>
            </Grid>
          )}
        </Box>

        {/* Reviews Tab */}
        <Box role="tabpanel" hidden={tabValue !== 3}>
          {tabValue === 3 && (
            <>
              {/* Reviews Summary */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ textAlign: 'center', mr: 3 }}>
                  <Typography variant="h3" component="div">{serviceData.rating}</Typography>
                  <Rating value={serviceData.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {serviceData.reviewCount} reviews
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  {/* This could show a breakdown of ratings (5 star, 4 star, etc.) */}
                  <Typography variant="body2">
                    Reviews indicate high satisfaction with the venue's ambiance, staff professionalism, and overall experience.
                  </Typography>
                </Box>
              </Box>

              {/* Reviews List */}
              <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
              <List>
                {serviceData.reviews.map((review) => (
                  <React.Fragment key={review.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={review.user} src={review.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography component="span" variant="subtitle1">
                              {review.user}
                            </Typography>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Rating value={review.rating} size="small" readOnly sx={{ mt: 0.5, mb: 1 }} />
                            <Typography variant="body2" color="text.primary" paragraph>
                              {review.comment}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </Box>

        {/* Location Tab */}
        <Box role="tabpanel" hidden={tabValue !== 4}>
          {tabValue === 4 && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <LocationOn color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {serviceData.location.address}
                </Typography>
                <Typography variant="body2" paragraph>
                  Easy access from downtown with public transportation options available. Free parking available on site.
                </Typography>
              </Box>
              
              {/* Map Placeholder - In a real app, you would use Google Maps or similar */}
              <Paper 
                elevation={2} 
                sx={{ 
                  height: 400, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  bgcolor: '#f5f5f5'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Map showing location at {serviceData.location.coordinates.lat}, {serviceData.location.coordinates.lng}
                </Typography>
              </Paper>
            </>
          )}
        </Box>

        {/* Provider Tab */}
        <Box role="tabpanel" hidden={tabValue !== 5}>
          {tabValue === 5 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={serviceData.provider.logo}
                    alt={serviceData.provider.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {serviceData.provider.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Established {serviceData.provider.established}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Contact Information:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {serviceData.provider.contactInfo.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {serviceData.provider.contactInfo.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Language fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {serviceData.provider.contactInfo.website}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>About {serviceData.provider.name}</Typography>
                <Typography variant="body1" paragraph>
                  {serviceData.provider.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom>Other Services</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {serviceData.provider.otherServices.map((service, index) => (
                    <Chip key={index} label={service} variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={handleBookingDialogClose}>
        <DialogTitle>Book {serviceData.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Select a date and time
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Available Dates:</Typography>
            <Grid container spacing={1}>
              {serviceData.availability.map((day, index) => (
                <Grid item key={index}>
                  <Chip
                    label={new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    clickable
                    color={selectedDate === day.date ? "primary" : "default"}
                    onClick={() => setSelectedDate(day.date)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {selectedDate && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Available Time Slots:</Typography>
              <Grid container spacing={1}>
                {serviceData.availability
                  .find(day => day.date === selectedDate)?.slots
                  .map((slot, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={slot}
                        clickable
                        color={selectedSlot === slot ? "primary" : "default"}
                        onClick={() => setSelectedSlot(slot)}
                      />
                    </Grid>
                  ))
                }
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingDialogClose}>Cancel</Button>
          <Button 
            onClick={handleBookingSubmit} 
            variant="contained"
            disabled={!selectedDate || !selectedSlot}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
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
    {selectedService && 
    <BookingDialog
    open={bookingOpen}
    handleClose={handleCloseBooking}
    service={selectedService}
    onConfirm={handleConfirmBooking}
    addBooking = {addBooking}
  />}
  <SuccessDialog open={openSuccess} handleClose={handleSnackbarClose} title={'Booking Confirmed Successfully!'} body={"Your booking has been successfully completed. Thank you for choosing us!"} action={'Booking details'} />
    </Container>
    
  );
};

export default ServiceDetail;