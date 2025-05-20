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


export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const {user, authAxios} = useAuth()
    const {fetchUserBookings} = useBookingContext()

    useEffect(()=>{
        const fetchBookings = async()=>{

            const res = await fetchUserBookings()
            setBookings(res)
            console.log(res);
        }
        fetchBookings()
    },[])



    return (
        <>
        <DrawerAppBar/>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
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
                    <TableCell>
                        <Button
                        variant="outlined"
                        color="primary"
                        size='small'
                        >
                        View
                        </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        </>
      );
        
};
