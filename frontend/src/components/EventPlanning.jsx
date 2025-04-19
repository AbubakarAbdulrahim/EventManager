import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Box
} from '@mui/material';
import { Search, FavoriteBorder, LocationOn } from '@mui/icons-material';
import BookingDialog from './BookingDialog'; // Make sure this path matches your project structure


// Sample data for services/venues
const services = [
  {
    id: 1,
    title: 'Elegant Venue',
    description: 'A spacious and modern venue perfect for weddings and corporate events.',
    price: '₦2000',
    image: 'https://via.placeholder.com/400x250',
    capacity: 200,
    location: 'New York'
  },
  {
    id: 2,
    title: 'Gourmet Catering',
    description: 'Delicious menus crafted by top chefs for your special occasion.',
    price: '₦1500',
    image: 'https://via.placeholder.com/400x250',
    capacity: 100,
    location: 'Los Angeles'
  },
  {
    id: 3,
    title: 'Live Music Band',
    description: 'Energetic live performances to set the perfect mood for your event.',
    price: '₦1200',
    image: 'https://via.placeholder.com/400x250',
    capacity: 0,
    location: 'Chicago'
  },
  // More services...
];

function EventPlanningDashboard() {
  // State for search filters
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    capacity: '',
    price: '',
    location: ''
  });

  // State for booking dialog integration
  const [selectedService, setSelectedService] = React.useState(null);
  const [bookingOpen, setBookingOpen] = React.useState(false);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Filter services based on search term and filter criteria.
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = 
    filters.capacity ? service.capacity >= Number(filters.capacity) : true;
    const matchesPrice = filters.price
      ? Number(service.price.replace('₦', '')) <= Number(filters.price)
      : true;
    const matchesLocation = filters.location
      ? service.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    return matchesSearch && matchesCapacity && matchesPrice && matchesLocation;
  });

  // Open the booking dialog with the selected service
  const handleBookNow = (service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  // Close the booking dialog and reset selected service
  const handleCloseBooking = () => {
    setBookingOpen(false);
    setSelectedService(null);
  };

  return (
    <Box>
      {/* Header with navigation actions */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Planner
          </Typography>
          <Button color="inherit">Profile</Button>
          <Button color="inherit">History</Button>
          <Button color="inherit">Messages</Button>
          <Button color="inherit">Cancel Booking</Button>
        </Toolbar>
      </AppBar>

      {/* Search & Filters */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: '#636e72' }} />
                  </InputAdornment>
                ),
              }}
                value={filters.location}
                  onChange={handleFilterChange}
                  label="Location"
                  variant="outlined"
                  name="location"
            />
          </Grid>
    
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Min Capacity"
                  variant="outlined"
                  name="capacity"
                  type="number"
                  value={filters.capacity}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Max Price"
                  variant="outlined"
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                />
              </Grid>
              
            </Grid>
          </Grid>
        </Grid>
        </Grid>
      </Box>

      {/* Service Cards */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {filteredServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                    {service.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookNow(service)}
                  >
                    Book Now
                  </Button>
                  <IconButton aria-label="add to favorites">
                    <FavoriteBorder />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Booking Dialog: Opens only when a service is selected */}
      {selectedService && (
        <BookingDialog
          open={bookingOpen}
          handleClose={handleCloseBooking}
          service={selectedService}
        />
      )}
    </Box>
  );
}

export default EventPlanningDashboard;
