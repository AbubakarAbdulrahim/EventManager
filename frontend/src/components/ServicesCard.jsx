// import styled from "@emotion/styled";
import { useServiceContext } from "../context/ServiceContext";
import { useBookingContext } from "../context/BookingsContext";
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
  styled,
  CardActionArea
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
import { useState } from "react";
import ServiceDetail from "./ServiceDetail";
import { Link } from "react-router-dom";


export default function ServicesCard({service}) {
  
  const [openDetail, setOpenDetail] = useState(false)
  const ServiceCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: theme.shadows[4]
    },
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }));

  const BookingTag = styled(Chip)(({ theme }) => ({
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(2),
        backgroundColor: '#033043',
        color: 'white',
        fontWeight: 'bold'
      }));
      
    const {isFavorite, addToFavorites, removeFromFavorites} = useServiceContext();
    const {isBooked} = useBookingContext();
    const booked = isBooked(service.id);
    const favorite = isFavorite(service.id);

    function addFavorite(e){
      e.preventDefault();
      if(favorite) removeFromFavorites(service.id)
      else addToFavorites(service)
  }

    const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenDetail(false);
  }
 let bookedService;
  if(booked === true){
    console.log(booked);
    bookedService = booked;

  }
  console.log(service.image);

  
    return (
      <Grid item xs={12} sm={6} md={4}>
          <ServiceCard>
               <CardActionArea component={Link} to={`/service/${service.id}`}>
               {bookedService && (<BookingTag label="Booked" />)}

              <CardMedia
                component="img"
                
                height="200"
                image={service.image}
                alt={service.name}
                sx={{ objectFit: 'cover' }}
              />
               </CardActionArea>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {service.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>

                  <StarIcon sx={{color: 'rgb(250, 175, 0)', fontSize:'1.3em'}}/>
                  <Typography variant="body2">
                    {service.rating}
                  </Typography>                </Box>
                  </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  {service.location}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Group sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {service.capacity} people
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    ₦
                    <Typography variant="body2">
                      {service.price.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{width: '100%', mt: 2, display: 'flex', alignItems: 'center'}}>
                <CardActionArea component={Link} to={`/service/${service.id}`}>

                <Button
                  variant="contained"
                  // color={bookings.includes(service.id) ? "error" : "primary"}
                  sx={{width:'100%', backgroundColor:"#033043"}}
                  // onClick={() => bookings.includes(service.id) ? handleCancelBooking(service.id) : handleBookNow(service)} 
                  // onClick={() => handleBookNow(service)} 
                  // onClick={addBookings}
                  
                >
                
                  {/* {booked ? 'Cancel Booking' : 'Book Now'} */}
                  Book Now
                  
                </Button>
                </CardActionArea>
                <IconButton 
                aria-label="add to favorites"
                onClick={addFavorite}
                >
                    {/* <FavoriteBorder /> */}
                    {favorite ? <Favorite sx={{color:'#ef4444'}}/> : <FavoriteBorder sx={{color:'#033043'}}/>}
                  </IconButton>
                </Box>
              </CardContent>
              </ServiceCard>
              <ServiceDetail open={openDetail} onClose={handleClose} service={service} favorite={favorite} addFavorite={addFavorite} />
              </Grid>
          
    )
};
