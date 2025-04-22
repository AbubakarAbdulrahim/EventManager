import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Card,
  CardMedia,
  Chip
} from '@mui/material';
import {
  Close,
  Favorite,
  FavoriteBorder,
  LocationOn,
  People,
  AttachMoney,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';

const ServiceDetailsDialog = ({ open, onClose, service, onBookNow, favorite, addFavorite }) => {
  if (!service) return null;

  const {
    name,
    mainImage,
    additionalImages = [],
    location,
    capacity,
    price,
    serviceInfo,
    type,
    venueType,
    availability = [],
    cuisineImages = [],
    isFavorite = false
  } = service;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="service-details-dialog"
    >
      <Box sx={{ position: 'relative' }}>
        {/* Main Image */}
        <Box
          component="img"
          src={mainImage || "/api/placeholder/800/400"}
          alt={name}
          sx={{
            width: '100%',
            height: { xs: 200, sm: 300 },
            objectFit: 'cover'
          }}
        />
        
        {/* Close button overlay */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            }
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent>
        {/* Service name and favorite button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" id="service-details-dialog">
            {name}
          </Typography>
          <IconButton
            onClick={(e) => addFavorite && addFavorite(e)}
            color={favorite ? "error" : "default"}
          >
            {favorite ? <Favorite sx={{color:'#ef4444'}}/> : <FavoriteBorder sx={{color:'#033043'}}/>}
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              About this {type}
            </Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {serviceInfo || "No description available."}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn color="primary" sx={{ mr: 1 }} fontSize="small" />
                <Typography variant="body2">
                  {location || "Location not specified"}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={1}>
                <People color="primary" sx={{ mr: 1 }} fontSize="small" />
                <Typography variant="body2">
                  Capacity: {capacity || "N/A"} people
                </Typography>
              </Box>
              
              {venueType && (
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime color="primary" sx={{ mr: 1 }} fontSize="small" />
                  <Typography variant="body2">
                    Venue Type: {venueType}
                  </Typography>
                </Box>
              )}
              
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoney color="primary" sx={{ mr: 1 }} fontSize="small" />
                <Typography variant="body2">
                  Price: {price ? `₹${price}` : "Contact for pricing"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            {availability.length > 0 ? (
              <Box>
                {availability.map((slot, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <CalendarToday color="primary" sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">
                      {slot.day}: {slot.startTime} - {slot.endTime}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No availability information provided.
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Additional images */}
        {additionalImages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Gallery
            </Typography>
            <Grid container spacing={1}>
              {additionalImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={image || "/api/placeholder/200/120"}
                      alt={`${name} - image ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Cuisine images for food services */}
        {type === "catering" && cuisineImages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Cuisine Gallery
            </Typography>
            <Grid container spacing={1}>
              {cuisineImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="120"
                      image={image || "/api/placeholder/200/120"}
                      alt={`Cuisine - image ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <Divider />
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => onBookNow && onBookNow()}
        >
          Book Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDetailsDialog;