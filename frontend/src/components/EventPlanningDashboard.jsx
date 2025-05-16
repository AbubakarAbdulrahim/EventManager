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
import { useServiceContext } from '../context/ServiceContext';
import { useAuth } from '../context/AuthContext';
import SuccessDialog from './SuccessDialog';
const SearchSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f5f6fa',
  borderRadius: theme.shape.borderRadius
}));

import { useEffect } from 'react';

// import { mockServices } from '../services/mockServices';


const transformServiceData = (backendData) => {
  // console.log(backendData);
  return backendData.map(service => ({
    id: service.id,
    type: service.service_type,
    name: service.service_name,
    location: service.location,
    status: service.status,
    capacity: parseInt(service.service_quantity, 10),
    price: service.pricing[0]?.base_price || 0, // fallback to 0 if pricing is empty
    image: service.service_images[0]?.image_url || '/placeholder.jpg',
    rating: 0 // Set default rating or fetch if available elsewhere
  }));
};


// const data = transformServiceData(mockServices);
  

const EventPlanningDashboard = ( props) => {
  const { fetchServices} = useServiceContext()
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    // const [selectedService, setSelectedService] = useState("");
    // const [bookingOpen, setBookingOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const {addBooking} = useBookingContext()
    const [searchFilters, setSearchFilters] = useState({
    location: '',
    capacity: '',
    priceRange: '',
    category: '',
  });


  // const handleBookService = (service) => {
  //   setBookings([...bookings, service.id]);
  //   setSelectedService("")
  //   setOpenSuccess(true);
  // };

  

  // const handleSnackbarClose = (event, reason) => {
  //   if (reason === 'clickaway') return;
  //   setOpenSuccess(false);
  //   // handleClose();
  // };
  // const handleConfirmBooking = () => {
  //     handleBookService(selectedService);
  // };
  
  // console.log(selectedService)

  useEffect(() => {
    async function fetchService () {
      try {
        const response = await fetchServices();
        const transformedData = transformServiceData(response);
        const filteredData = transformedData.filter(service=>
          service.status !== 'pending'
        )
        setServices(filteredData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
    fetchService();
  }, []);



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

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {});
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
                <MenuItem value="">All Category</MenuItem>
                <MenuItem value={"venue"}>Venue</MenuItem>
                <MenuItem value={"music"}>Music</MenuItem>
                <MenuItem value={"Caterer"}>Caterers</MenuItem>
              </Select>
            </Grid>
            
          </Grid>
        </SearchSection>

        {/* Services Grid */}
        {/* <Grid container spacing={3} sx={{ p: 4 }}>
          {filteredServices.map((service)=> {(service.type === "venue") && <ServicesCard key={service.id} service={service} bookings={bookings} handleBookNow={handleBookNow} handleCancelBooking={handleCancelBooking}/> })}
        </Grid> */}
        {/* <Grid container spacing={3} sx={{ p: 4 }}>
          {filteredServices.map((service)=> <ServicesCard key={service.id} service={service} bookings={bookings} handleBookNow={handleBookNow} handleCancelBooking={handleCancelBooking}/>)}
        </Grid> */}
        {services.length === 0 && (
          <Typography variant="h6" sx={{ p: 4, color: '#0a7273', textAlign: 'center' }}>
            No services available at the moment.
          </Typography>
        )}
        {Object.keys(groupedServices).map((type) => (<div key={type}>

          <Typography variant='h4' sx={{pl:5, pt:2, fontWeight:'550', color:'#0a7273'}} >{type.charAt(0).toUpperCase() + type.slice(1)}s</Typography>
          <Grid container spacing={3} sx={{ p: 4 }}>
          {groupedServices ? groupedServices[type].map((service) => (
            <ServicesCard 
              key={service.id}
              service={service}
              
  
            />
          )) : <Typography>
            No {type.charAt(0).toUpperCase() + type.slice(1)}s available at the moment.
          </Typography>}
        </Grid>
        </div>
          ))}

        {/* {selectedService && (
                <BookingDialog
                  open={bookingOpen}
                  handleClose={handleCloseBooking}
                  service={selectedService}
                  onConfirm={handleConfirmBooking}
                  addBooking = {addBooking}
                />
        )} 
        <SuccessDialog open={openSuccess} handleClose={handleSnackbarClose} title={'Booking Confirmed Successfully!'} body={"Your booking has been successfully completed. Thank you for choosing us!"} action={'Booking details'} /> */}

        
      </div>
  );
};

export default EventPlanningDashboard;