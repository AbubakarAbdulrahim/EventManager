import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Box, CssBaseline, Divider, Container, Grid, Paper, Card, CardContent, CardActions, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, 
  Avatar, Chip, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, 
  Alert, CircularProgress, Badge, ThemeProvider, createTheme, useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, AddCircle, Delete, Edit, Visibility, 
  VisibilityOff, Person, Business, AttachMoney, Settings as SettingsIcon, 
  Logout, Menu as MenuIcon, Search, CheckCircle, Cancel, Star
} from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DrawerAppBar from '../../components/DrawerAppBar';
import { useAuth } from '../../context/AuthContext';
import { useBookingContext } from '../../context/BookingsContext';
import BookingCard from '../../components/BookingCard';
import LabelBottomNavigation from '../../components/LabelBottomNavigation';
import BottomFooter from '../../components/BottomFooter';
import {Rating} from '@mui/material';


export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const {user, authAxios} = useAuth()
    const [openReview, setOpenReview] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const {fetchUserBookings} = useBookingContext()
    const [loading, setLoading] = useState()
    const [open, setOpen] = useState()
    const [selectedBooking, setSelectedBooking] = useState()

    useEffect(()=>{
        const fetchBookings = async()=>{
            setLoading(true)
            const res = await fetchUserBookings()
            setBookings(res)
            console.log(res);
        }
        fetchBookings()
        setLoading(false)
    },[])

    const handleSubmitReview = async() => {
     const data = { rating: userRating, comment: reviewText }
    try{
      const res = await authAxios.post(`/user/create-review/${selectedBooking.service.id}/`, data)
      console.log(res);
      
    }catch(err){
      console.error(err);
      
    }
    setOpenReview(false);
    setUserRating(0);
    setReviewText('');
  };



    return (
        <>
        <DrawerAppBar/>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} >
          <Typography variant="h4" component="h1" gutterBottom>
            Bookings
          </Typography>
    
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length >0 ? bookings.map((booking) => (
                  !loading ? <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.service.service_name}</TableCell>
                    <TableCell>{booking.vendor.business_name}</TableCell>
                    <TableCell>{booking.vendor.user.phone_number}</TableCell>
                    <TableCell>{booking.vendor.user.email}</TableCell>
                    <TableCell>₦{booking.total_price}</TableCell>
                    <TableCell>{booking.event_date}</TableCell>
                    <TableCell>{booking.start_time}</TableCell>
                    <TableCell>{booking.end_time}</TableCell>
                    <TableCell>
                        {booking.status === 'completed' ? (
                        <Chip color="success" label="Completed" />
                        ) : booking.status === 'cancelled' ? (
                        <Chip color="error" label="Cancelled" />) :
                        (<Chip color="default" label="Pending" />
                        )}
                    </TableCell>
                    <TableCell sx={{display:'flex', gap:'10px'}}>
                        <Button
                        variant="outlined"
                        color="primary"
                        size='small'
                        onClick={()=>{
                          setSelectedBooking(booking)
                          setOpen(true)
                        }}
                        >
                        View
                        </Button>
                        <Button
                        variant="outlined"
                        color="primary"
                        size='small'
                        onClick={()=>{
                          setSelectedBooking(booking)
                          setOpenReview(true)
                        }}
                        >
                        Review
                        </Button>
                    </TableCell>

                  </TableRow> : 
                  <TableRow>
                        <TableCell><CircularProgress/></TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={11} align='center'>No bookings to show</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        {selectedBooking && 
        <Dialog
        open={open}
        onClose={()=>{setOpen(false)}}
        maxWidth='xs'
        fullWidth
        >
          <DialogTitle>

            <Typography variant="h4" gutterBottom align="center">
                Booking Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            {/* <Box sx={{ padding: 2, maxWidth: 500, margin: '0 auto', boxShadow: 3, borderRadius: 2, background: '#fff' }}> */}
            {/* <Box sx={{ mt: 3 }}> */}
                <Typography variant="subtitle1"><b>Service Name:</b> {selectedBooking.service.service_name}</Typography>
                <Typography variant="subtitle1"><b>Vendor Name:</b> {selectedBooking.vendor.business_name}</Typography>
                <Typography variant="subtitle1"><b>Date:</b> {selectedBooking.event_date}</Typography>
                <Typography variant="subtitle1"><b>Start Time:</b> {selectedBooking.start_time}</Typography>
                <Typography variant="subtitle1"><b>End Time:</b> {selectedBooking.end_time}</Typography>
                <Typography variant="subtitle1"><b>Duration:</b> {selectedBooking.duration}</Typography>
                <Typography variant="subtitle1"><b>Price:</b> ₦{selectedBooking.total_price}</Typography>
                {/* <Typography variant="subtitle1"><b>Created At:</b> {selectedBooking.createdAt}</Typography> */}
                <Typography variant="subtitle1"><b>Status:</b> {selectedBooking.status}</Typography>
            {/* </Box> */}
        {/* </Box> */}

          </DialogContent>
          <DialogActions>
              <Button variant='outlined' onClick={()=>{setOpen(false)}} >
                  Close
              </Button>

          </DialogActions>
        </Dialog>}
        <BottomFooter/>
        <LabelBottomNavigation/>
        <Dialog 
        open={openReview} 
        onClose={() => setOpenReview(false)} 
        maxWidth='sm'
      >
        <DialogTitle>Write a Review</DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography component="legend" sx={{ mr: 2 }}>Your Rating:</Typography>
            <Rating
              name="user-rating"
              value={userRating}
              onChange={(event, newValue) => {
                setUserRating(newValue);
              }}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        
        <DialogActions>
          <Button 
            variant="contained"
            onClick={handleSubmitReview}
            disabled={!userRating || !reviewText.trim()}
            // endIcon={<Send />}
            sx={{ 
              backgroundColor: '#033043',
              '&:hover': { backgroundColor: '#022030' }
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
        </>
      );
        
};
