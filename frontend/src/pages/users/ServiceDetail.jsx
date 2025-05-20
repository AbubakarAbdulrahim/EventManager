import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Modal} from '@mui/material';
import '../../services/leaflet-icon-fix'
import OpenStreetMapView from '../../components/OpenStreetMapView'
import { geocodePlace } from '../../services/geoCodePlace';
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

import {useAuth} from '../../context/AuthContext';
import {useVendorContext} from '../../context/VendorContext';
import { use } from 'react';

// Function to transform backend data to the format our component expects
const transformServiceData = (backendData) => {
  console.log(backendData);
  return backendData.map(service => ({
    id: service.id,
    name: service.service_name,
    type: service.service_type,
    location: service.location,
    amenities: service.amenities,
    description: service.description,
    capacity: parseInt(service.service_quantity, 10),
    mode: service.service_mode,
    availability: {
      type: service.availability_type,
      startDate: service.availability_start_date,
      endDate: service.availability_end_date,
      recurring: service.recurring_avail || [],
      specificDates: service.specific_date_avail || [],
    },
    status: service.status,
    createdAt: service.created_at,
    updatedAt: service.updated_at,
    images: service.service_images.map(img => img.image_url),
    mainImage: service.service_images[0]?.image_url || '/placeholder.jpg',
    priceModel: service.pricing[0]?.model_type || 'unknown',
    basePrice: parseFloat(service.pricing[0]?.base_price || 0),
    pricePackages: service.pricing[0]?.price_packages || [],
    rating: 4.5, // Default rating since backend doesn't provide it
    reviewCount: 150, // Default review count
    provider: {
      id: service.vendor,
      name: "Service Provider", // Fallback if not returned by backend
      description: "Professional service provider with extensive experience.",
      logo: "/api/placeholder/100/100",
      contactInfo: {
        phone: "+234-XXX-XXX-XXXX",
        email: "contact@serviceprovider.com",
        website: "www.serviceprovider.com"
      },
      established: 2020,
      otherServices: ["Catering", "Decoration", "Event Planning"]
    }
  }));
};

const formatTime = (timeStr) =>
  new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

// Generate sample reviews since backend doesn't provide them
const generateSampleReviews = () => [
  {
    id: 1,
    user: "Jennifer Smith",
    avatar: "/api/placeholder/50/50",
    rating: 5,
    date: "2025-03-15",
    comment: "Great service! Everything was exactly as described and the staff was professional."
  },
  {
    id: 2,
    user: "Robert Johnson",
    avatar: "/api/placeholder/50/50",
    rating: 4,
    date: "2025-02-28",
    comment: "Good experience overall. Would recommend for events and gatherings."
  },
  {
    id: 3,
    user: "Michelle Davis",
    avatar: "/api/placeholder/50/50",
    rating: 5,
    date: "2025-01-10",
    comment: "Exceeded our expectations! The venue was perfect for our event."
  }
];

// Generate sample availability dates
const generateAvailabilityDates = (startDate, endDate) => {
  const result = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    result.push({
      date: date.toISOString().split('T')[0],
      slots: ["Morning", "Afternoon", "Evening"]
    });
  }
  
  return result;
};

const ServiceDetail = () => {
  const { authAxios } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const { id } = useParams();
  const [service, setService] = useState(null);
  const {isFavorite, addToFavorites, removeFromFavorites, fetchServices} = useServiceContext();
  const {fetchVendors} = useVendorContext();
  const {isBooked, addBooking, cancelBooking} = useBookingContext();
  const [booked, setBooked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [coords, setCoords] = useState(null);
  const [bookingId, setBookingId] = useState(1)

   useEffect(() => {
    geocodePlace(service?.location)
      .then(setCoords)
      .catch(console.error)
      // .finally(() => setLoading(false));
  }, [service?.location]);

  // First, let's update the useEffect to fetch both services and vendor details
useEffect(() => {
  const loadServiceAndVendor = async () => {
    setIsLoading(true);
    try {
      // Fetch services
      const servicesResponse = await fetchServices();
      const transformedServices = transformServiceData(servicesResponse);
      setServices(transformedServices);
      
      // Find the requested service by ID
      const foundService = transformedServices.find(s => s.id.toString() === id);
      
      if (foundService) {
        // Add sample reviews and availability dates
        foundService.reviews = generateSampleReviews();
        // foundService.availability = generateAvailabilityDates(
        //   foundService.availability.startDate,
        //   foundService.availability.endDate
        // );
        
        // Store the service
        setService(foundService);

        
        // Fetch vendor details using the vendor_id from the service
        if (foundService.provider.id) {
          try {
            const vendorsResponse = await fetchVendors();
            const vendorDetails = vendorsResponse.find(v => v.id === foundService.provider.id);
            
            if (vendorDetails) {
              // Update the service with actual provider details
              foundService.provider = {
                id: vendorDetails.id,
                name: vendorDetails.business_name || "Service Provider",
                description: vendorDetails.description || "Professional service provider with extensive experience.",
                logo: vendorDetails.logo_url || "/api/placeholder/100/100",
                contactInfo: {
                  phone: vendorDetails.user.phone_number || "+234-XXX-XXX-XXXX",
                  email: vendorDetails.user.email || "contact@serviceprovider.com",
                  website: vendorDetails.website || "www.serviceprovider.com"
                },
                established: vendorDetails.established_year || 2020,
                otherServices: vendorDetails.services.map(service=>{const arr =[]; arr.push(service.service_type); return arr}) || ["Catering", "Decoration", "Event Planning"]
              };
              
              // Update the service state with vendor details
              setService({...foundService});
            }
          } catch (vendorError) {
            console.error("Error fetching vendor details:", vendorError);
          }
        }
        
        // Check if service is booked/favorited
        if (isBooked) setBooked(isBooked(foundService.id));
        if (isFavorite) setFavorite(isFavorite(foundService.id));
      } else {
        // Fallback to mock service if not found
        const mockService = mockServices.find((s) => s.id.toString() === id);
        if (mockService) {
          setService(mockService);
          if (isBooked) setBooked(isBooked(mockService.id));
          if (isFavorite) setFavorite(isFavorite(mockService.id));
        }
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      // Fallback to mock data on error
      const mockService = mockServices.find((s) => s.id.toString() === id);
      if (mockService) {
        setService(mockService);
        if (isBooked) setBooked(isBooked(mockService.id));
        if (isFavorite) setFavorite(isFavorite(mockService.id));
      }
    } finally {
      setIsLoading(false);
    }
  };

  loadServiceAndVendor();
}, []);

  
    

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle image modal
  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  // Handle favorites
  function addFavorite(e) {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(service.id);
      setFavorite(false);
    } else {
      addToFavorites(service);
      setFavorite(true);
    }
  }

  // Handle booking dialog
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
    setSelectedService("");
    setOpenSuccess(true);
    setOpenBookingDialog(false);
  };

  const formatHours = (hours) =>{
    const hh = String(hours).padStart(2, '0');
    return `${hh}:00:00`
  }

  const handleConfirmBooking = async (item) => {
    const end_time = (parseInt(item.time) + parseInt(item.duration)).toString()
    const newTime =new Date(`1970-01-01T${end_time +':00'}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
  const duration = formatHours(item.duration)
    const data = {
      event_date: item.date,
      vendor_id: service?.provider?.id,
      start_time: item.time,
      end_time: newTime,
      total_price: item.price,
      duration: duration,
      service_id: service.id,
    }

    console.log(service);
    try{
      const response = await authAxios.post('/bookings/create/', data)
      const booking = response.data
      console.log(booking);
      setBookingId(booking.id)
    } catch(error){
      console.log(error);
    }
    handleBookService(selectedService);
    addBooking(selectedService);
    setBooked(true);
  };

  // Close the booking dialog and reset selected service
  const handleCloseBooking = () => {
    setSelectedService('');
    setBookingOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSuccess(false);
  };

  const handleCancelBooking = (serviceId) => {
    setBookings(bookings.filter(id => id !== serviceId));
  };

  function addBookings(e) {
    e.preventDefault();
    if (booked) {
      cancelBooking(service.id); 
      handleCancelBooking(service.id);
      setBooked(false);
    } else {
      handleBookNow(service);
    }
  }

  // Show loading indicator while data is being fetched
  if (isLoading || !service) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Extract features for display
  const features = [
    `Capacity: ${service.capacity} people`,
    `Location: ${service.location}`,
    `Type: ${service.type}`,
    `Mode: ${service.mode || 'Standard'}`,
    `Amenities: ${service.amenities.map(item=> item.name)}`,

  ];

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
            onClick={(e) => addFavorite(e)}
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
              image={service.mainImage || service.images?.[0] || "/api/placeholder/800/500"}
              alt={service.name}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={1}>
            {/* Show service images in a grid */}
            {(service.images || []).slice(0, 4).map((image, index) => (
              <Grid item xs={6} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    border: '2px solid #033043',
                    opacity: 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={image}
                    alt={`${service.name} view ${index + 1}`}
                    onClick={() => handleOpenImage(image)}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Price and Booking Button */}
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ₦{service.basePrice || "Price on request"}
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={addBookings}
              sx={{ bgcolor: '#033043' }}
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
              {service.description || "No description available"}
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
              {/* Header showing overall availability dates */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Service Available from {new Date(service.availability.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} to {new Date(service.availability.endDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </Typography>
              </Grid>

              {service.availability.type === 'specific_date' && service.availability.specificDates.length > 0 ? (          
                service.availability.specificDates.slice(0, 8).map((dateAvail, index) => (            
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>              
                    <Paper elevation={1} sx={{ p: 2 }}>                
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>                  
                        <DateRange color="primary" sx={{ mr: 1 }} />                  
                        <Typography variant="subtitle1">                    
                          {new Date(dateAvail.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}                  
                        </Typography>                
                      </Box>                
                      <Divider sx={{ my: 1 }} />                
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>                  
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>                    
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />                    
                          <Typography variant="body2">
                            Opening Time: {formatTime(dateAvail.start_time)}
                          </Typography>                  
                        </Box>                  
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>                    
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />                    
                          <Typography variant="body2">
                            Closing Time: {formatTime(dateAvail.end_time)}
                          </Typography>                  
                        </Box>                
                      </Box>              
                    </Paper>            
                  </Grid>          
                ))        
              ) : service.availability.type === 'recurring' && service.availability.recurring.length > 0 ? (         
                service.availability.recurring.slice(0, 8).map((recurAvail, index) => (            
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>              
                    <Paper elevation={1} sx={{ p: 2 }}>                
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>                  
                        <DateRange color="primary" sx={{ mr: 1 }} />                  
                        <Typography variant="subtitle1">                    
                          {'Every ' + (() => {                     
                            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];                     
                            return days[recurAvail.day_of_the_week];                   
                          })()}                  
                        </Typography>                
                      </Box>                
                      <Divider sx={{ my: 1 }} />                
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>                  
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>                    
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />                    
                          <Typography variant="body2">
                            Opening Time: {formatTime(recurAvail.start_time)}
                          </Typography>                  
                        </Box>                  
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>                    
                          <AccessTime fontSize="small" sx={{ mr: 1 }} />                    
                          <Typography variant="body2">
                            Closing Time: {formatTime(recurAvail.end_time)}
                          </Typography>                  
                        </Box>                
                      </Box>              
                    </Paper>            
                  </Grid>          
                ))       
              ) : (          
                <Grid item xs={12}>            
                  <Typography>              
                    No specific availability information available.            
                  </Typography>          
                </Grid>        
              )}      
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
                  <Typography variant="h3" component="div">{service.rating.toFixed(1)}</Typography>
                  <Rating value={service.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {service.reviewCount || 189} reviews
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">
                    Reviews indicate high satisfaction with this service, staff professionalism, and overall experience.
                  </Typography>
                </Box>
              </Box>

              {/* Reviews List */}
              <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
              <List>
                {service.reviews && service.reviews.length > 0 ? (
                  service.reviews.map((review) => (
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
                  ))
                ) : (
                  <Typography>No reviews available yet.</Typography>
                )}
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
                  {service.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  Easy access with convenient transportation options available.
                </Typography>
              </Box>
              
              {/* Map Placeholder */}
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
                  {/* Map showing location at {service.location} */}
                </Typography>
                  <OpenStreetMapView lat={coords.lat} lng={coords.lng} />
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
                    image={service.provider.logo || "/api/placeholder/100/100"}
                    alt={service.provider.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.provider.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Established {service.provider.established}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Contact Information:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {service.provider.contactInfo.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Email fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {service.provider.contactInfo.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Language fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {service.provider.contactInfo.website}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>About {service.provider.name}</Typography>
                <Typography variant="body1" paragraph>
                  {service.provider.description}
                </Typography>
                
                <Typography variant="h6" gutterBottom>Other Services</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {service.provider.otherServices && service.provider.otherServices.map((service, index) => (
                    <Chip key={index} label={service} variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>

      {/* Image Modal */}
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
            alt="Service" 
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

      {/* Booking Dialog */}
      {selectedService && 
        <BookingDialog
          open={bookingOpen}
          handleClose={handleCloseBooking}
          service={selectedService}
          onConfirm={handleConfirmBooking}
          addBooking={addBooking}
        />
      }

      {/* Success Dialog */}
      <SuccessDialog 
        open={openSuccess} 
        handleClose={handleSnackbarClose} 
        title={'Booking Confirmed Successfully!'} 
        body={"Your booking has been successfully completed. Thank you for choosing us!"} 
        action={'Booking details'}
        url={`/booking/${bookingId}`}
      />
    </Container>
  );
};

export default ServiceDetail;