import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  IconButton, 
  Card, 
  CardMedia, 
  CardContent, 
  Divider, 
  Chip, 
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  Favorite, 
  FavoriteBorder, 
  LocationOn, 
  People, 
  AttachMoney, 
  CalendarToday, 
  AccessTime 
} from '@mui/icons-material';

const ServiceDetail = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service details');
        }
        const data = await response.json();
        setService(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Add logic to save favorite status to backend or local storage
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
    // Add your booking logic here
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h4" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGoBack} 
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!service) {
    return null;
  }

  const { 
    name, 
    mainImage, 
    additionalImages, 
    location, 
    capacity, 
    price, 
    serviceInfo, 
    type, 
    venueType, 
    availability, 
    cuisineImages 
  } = service;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header with back button */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleGoBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to listings
          </Button>
        </Box>

        {/* Service name and favorite button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {name}
          </Typography>
          <IconButton 
            onClick={toggleFavorite}
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' } 
            }}
          >
            {isFavorite ? 
              <Favorite color="error" /> : 
              <FavoriteBorder />
            }
          </IconButton>
        </Box>

        {/* Main image */}
        <Paper 
          elevation={3} 
          sx={{ 
            mb: 4, 
            borderRadius: 2, 
            overflow: 'hidden' 
          }}
        >
          <Box 
            component="img"
            src={mainImage || "/api/placeholder/800/400"} 
            alt={name}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover'
            }}
          />
        </Paper>

        {/* Service details */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                About this {type}
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                {serviceInfo || "No description available."}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOn color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {location || "Location not specified"}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Capacity: {capacity || "N/A"} people
                  </Typography>
                </Box>
                
                {venueType && (
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTime color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Venue Type: {venueType}
                    </Typography>
                  </Box>
                )}
                
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoney color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Price: {price ? `₹${price}` : "Contact for pricing"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                Availability
              </Typography>
              {availability && availability.length > 0 ? (
                <Box>
                  {availability.map((slot, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={1}>
                      <CalendarToday color="primary" sx={{ mr: 1 }} fontSize="small" />
                      <Typography variant="body1">
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No availability information provided.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Additional images */}
        {additionalImages && additionalImages.length > 0 && (
          <Box mb={4}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Gallery
            </Typography>
            <Grid container spacing={2}>
              {additionalImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image || "/api/placeholder/400/300"}
                      alt={`${name} - image ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Cuisine images for food services */}
        {type === "catering" && cuisineImages && cuisineImages.length > 0 && (
          <Box mb={4}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              Cuisine Gallery
            </Typography>
            <Grid container spacing={2}>
              {cuisineImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image || "/api/placeholder/400/300"}
                      alt={`Cuisine - image ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Call to action */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }}>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                Ready to book this {type}?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Secure your booking now before it's gone!
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={handleBookNow}
              sx={{ mt: { xs: 2, md: 0 }, px: 4, py: 1.5 }}
            >
              Book Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServiceDetail;