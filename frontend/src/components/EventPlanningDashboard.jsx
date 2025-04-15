import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Slider,
  Select,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Badge,
  Box,
  styled
} from '@mui/material';
import {
  Search,
  FilterList,
  Message,
  Person,
  Event,
  Cancel,
  LocationOn,
  Group,
  AttachMoney,
  FavoriteBorder
} from '@mui/icons-material';
import BookingDialog from './BookingDialog';
import StarIcon from '@mui/icons-material/Star';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorderRounded } from '@mui/icons-material';
import ServicesCard from './ServicesCard';
import {
  Snackbar, Alert
} from '@mui/material';
import { useBookingContext } from '../context/BookingsContext';

const SearchSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f6fa',
  borderRadius: theme.shape.borderRadius
}));







const mockServices = [ 
  { id: 1, type: 'venue', name: 'Taheer Guest Palace', location: 'Tarauni', capacity: 200, price: 7000, image: '/image1.jpg', rating: 4.5 },
  { id: 2, type: 'venue', name: 'Bristol Palace Hotel', location: 'Farm Centre', capacity: 500, price: 15000, image: '/image1.jpg', rating: 4.8 },
  { id: 3, type: 'venue', name: 'Prince Hotel', location: 'GRA', capacity: 300, price: 10000, image: '/image1.jpg', rating: 4.3 },
  { id: 4, type: 'venue', name: 'Green Palace Hotel', location: 'Nassarawa', capacity: 250, price: 8000, image: '/image1.jpg', rating: 4.2 },
  { id: 5, type: 'venue', name: 'Afficent Event Centre', location: 'Kofar Ruwa', capacity: 600, price: 20000, image: '/image1.jpg', rating: 4.9 },
  { id: 6, type: 'venue', name: 'Meena Event Centre', location: 'Miller Road', capacity: 400, price: 12000, image: '/image1.jpg', rating: 4.6 },
  { id: 7, type: 'venue', name: 'Royal Tropicana Hotel', location: 'Zaria Road', capacity: 350, price: 9000, image: '/image1.jpg', rating: 4.4 },
  { id: 8, type: 'venue', name: 'Horizon Hotels', location: 'Gidan Rumfa', capacity: 450, price: 13000, image: '/image1.jpg', rating: 4.7 },
  { id: 9, type: 'venue', name: 'Tahir Guest House', location: 'Hotoro', capacity: 200, price: 6000, image: '/image1.jpg', rating: 4.1 },
  { id: 10, type: 'caterer', name: 'Gusto Catering Services', location: 'Tarauni', capacity: 500, price: 15000, image: '/image1.jpg', rating: 4.8 },
  { id: 11, type: 'caterer', name: 'Food Haven', location: 'GRA', capacity: 300, price: 9000, image: '/image1.jpg', rating: 4.3 },
  { id: 12, type: 'caterer', name: 'Delicious Bites', location: 'Zaria Road', capacity: 400, price: 12000, image: '/image1.jpg', rating: 4.6 },
  { id: 13, type: 'caterer', name: 'Supreme Tastes', location: 'Farm Centre', capacity: 450, price: 14000, image: '/image1.jpg', rating: 4.7 },
  { id: 14, type: 'caterer', name: 'Royal Dishes', location: 'Miller Road', capacity: 350, price: 11000, image: '/image1.jpg', rating: 4.2 },
  { id: 15, type: 'caterer', name: 'Savor Kitchen', location: 'Hotoro', capacity: 250, price: 8000, image: '/image1.jpg', rating: 4.0 },
  { id: 16, type: 'caterer', name: 'Tasty Treats', location: 'Nassarawa', capacity: 300, price: 10000, image: '/image1.jpg', rating: 4.5 },
  { id: 17, type: 'caterer', name: 'Elite Foods', location: 'Kofar Ruwa', capacity: 400, price: 12000, image: '/image1.jpg', rating: 4.6 },
  { id: 18, type: 'caterer', name: 'Golden Cuisine', location: 'Gidan Rumfa', capacity: 500, price: 15000, image: '/image1.jpg', rating: 4.9 },
  { id: 19, type: 'caterer', name: 'Classic Caterers', location: 'GRA', capacity: 350, price: 11000, image: '/image1.jpg', rating: 4.3 },
  { id: 20, type: 'caterer', name: 'Fine Dining Services', location: 'Downtown', capacity: 450, price: 14000, image: '/image1.jpg', rating: 4.7 },
  { id: 21, type: 'musician', name: 'Hamisu Breaker', location: 'Kano City', capacity: 1000, price: 50000, image: '/image1.jpg', rating: 4.9 },
  { id: 22, type: 'musician', name: 'Naziru Sarkin Waka', location: 'Tarauni', capacity: 800, price: 40000, image: '/image1.jpg', rating: 4.8 },
  { id: 23, type: 'musician', name: 'Ali Jita', location: 'GRA', capacity: 700, price: 35000, image: '/image1.jpg', rating: 4.4 },
  { id: 24, type: 'musician', name: 'Ado Gwanja', location: 'Farm Centre', capacity: 600, price: 30000, image: '/image1.jpg', rating: 4.5 },
  { id: 25, type: 'musician', name: 'Umar M Shareef', location: 'Nassarawa', capacity: 900, price: 45000, image: '/image1.jpg', rating: 4.7 },
  { id: 26, type: 'musician', name: 'Sadiq Saleh', location: 'Zaria Road', capacity: 750, price: 32000, image: '/image1.jpg', rating: 4.3 },
  { id: 27, type: 'musician', name: 'Adam A Zango', location: 'Kofar Ruwa', capacity: 850, price: 38000, image: '/image1.jpg', rating: 4.6 }
];



  

const EventPlanningDashboard = ( props) => {
    const [services, setServices] = useState(mockServices);
    const [bookings, setBookings] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [bookingOpen, setBookingOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const {addBooking} = useBookingContext()
    const [searchFilters, setSearchFilters] = useState({
    location: '',
    capacity: '',
    priceRange: '',
    category: '',
  });

  const handleBookNow = (service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  // Close the booking dialog and reset selected service
  const handleCloseBooking = () => {
    setBookingOpen(false);
    setSelectedService(null);
  };

  const handleBookService = (service) => {
    setBookings([...bookings, service.id]);
    setSelectedService("")
    setOpenSuccess(true);
  };

  const handleCancelBooking = (serviceId) => {
    setBookings(bookings.filter(id => id !== serviceId));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSuccess(false);
    // handleClose();
  };
  const handleConfirmBooking = () => {
      handleBookService(selectedService);
  };
  
  // console.log(selectedService)
  console.log(bookings)
  const filteredServices = services.filter(service => {
    return (
      service.location.toLowerCase().includes(searchFilters.location.toLowerCase()) &&
      (searchFilters.capacity ? service.capacity >= searchFilters.capacity : true)
      &&
      (searchFilters.priceRange ? service.price <= searchFilters.priceRange : true) 
      &&
      (service.name.toLowerCase().includes(props.searchTerm.toLowerCase()))
      &&
      (service.type.toLowerCase().includes(searchFilters.category.toLowerCase()))
      // (searchFilters.category ? service.category >= searchFilters.category : true)
    );
  });

  // console.log(filteredServices)

  return (
      <div>
        {/* Search & Filters */}
        <SearchSection>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                placeholder='Kano city..'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn sx={{ color: '#033043' }} />
                    </InputAdornment>
                  ),
                  }}
                onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                sx={{
                  '& label.Mui-focused': {
                    color: '#033043',
                  },
                  '& label': {
                      color: '#033043',
                  },
                  
                  '& .MuiOutlinedInput-root': {
                    color:"#033043",
                    '&.Mui-focused fieldset': {
                      borderColor: '#033043',
                    },
                  },
                }}
              
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Min Capacity"
                onChange={(e) => setSearchFilters({...searchFilters, capacity: e.target.value})}
                type='number'
                value={searchFilters.capacity}
                sx={{
                  '& label.Mui-focused': {
                    color: '#033043',
                  },
                  '& label': {
                      color: '#033043',
                  },
                  
                  '& .MuiOutlinedInput-root': {
                    color:"#033043",
                    '&.Mui-focused fieldset': {
                      borderColor: '#033043',
                    },
                  },
                }}
              />
            </Grid>
        
                
            <Grid item xs={6} md={3}>
              <Select
                fullWidth
                value={searchFilters.priceRange}
                onChange={(e) => setSearchFilters({...searchFilters, priceRange: e.target.value})}
                displayEmpty
                sx={{ 
                  color:'#033043',
                  '&.MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#033043',
                    },}
                  }}
              >
                <MenuItem value="">All Price Ranges</MenuItem>
                <MenuItem value={1000}>Under ₦1000</MenuItem>
                <MenuItem value={5000}>Under ₦5000</MenuItem>
                <MenuItem value={10000}>Under ₦10,000</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <Select
                fullWidth
                value={searchFilters.category}
                onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
                displayEmpty
                sx={{ 
                  color:'#033043',
                  '&.MuiOutlinedInput-root': {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#033043',
                    },}
                  }}
              >
                <MenuItem value="">Category</MenuItem>
                <MenuItem value={"venue"}>Venue</MenuItem>
                <MenuItem value={"music"}>Music</MenuItem>
                <MenuItem value={"Caterer"}>Caterers</MenuItem>
              </Select>
            </Grid>
            
          </Grid>
        </SearchSection>

        {/* Services Grid */}
        <Grid container spacing={3} sx={{ p: 4 }}>
          {filteredServices.map((service)=> <ServicesCard key={service.id} service={service} bookings={bookings} handleBookNow={handleBookNow} handleCancelBooking={handleCancelBooking}/>)}
        </Grid>


        {/* Booking Dialog */}
        {/* <BookingDialog
        open={bookingOpen}
        service={selectedService}
        onClose={() => {setSelectedService("")}}
        onConfirm={handleConfirmBooking}
        /> */}
        {selectedService && (
                <BookingDialog
                  open={bookingOpen}
                  handleClose={handleCloseBooking}
                  service={selectedService}
                  onConfirm={handleConfirmBooking}
                  addBooking = {addBooking}
                />
        )} 
        <Snackbar
                open={openSuccess}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                  Booking Confirmed Successfully!
                </Alert>
              </Snackbar>


        
      </div>
  );
};

export default EventPlanningDashboard;