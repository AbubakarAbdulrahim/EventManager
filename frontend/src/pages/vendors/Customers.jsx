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
import { useBookingContext } from '../../context/BookingsContext';

const transformedData = (customer) =>{
  return customer.map(data=>{

    return {
              id: data.id,
              name: data.user.full_name,
              email: data.user.email,
              phone: data.user.phone_number,
              services: [1,2,3],
              totalSpent: data.total_price
    }
  })
}

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const {fetchVendorBookings} = useBookingContext()
    
    useEffect(()=>{
      fetchBookings()
    },[])

    const fetchBookings = async () =>{
      try{
        const res = await fetchVendorBookings();
        const grouped = {};

        res.forEach((item) => {
          const userId = item.user.id;
          if (!grouped[userId]) {
            grouped[userId] = {
              id: userId,
              user: item.user,
              services: [],
              bookings: [],
              totalSpent: item.total_price
            };
          }
          grouped[userId].services.push(item.service);
          grouped[userId].bookings.push(item.service);
        });
        console.log(Object.values(grouped));
        const data = transformedData(res)
        setCustomers(Object.values(grouped))
      } catch(err){
        console.error(err)
      }
    }

    return (
        <>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Customers
          </Typography>
    
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Bookings</TableCell>
                  <TableCell>Total Spent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.user.full_name}</TableCell>
                    <TableCell>{customer.user.email}</TableCell>
                    <TableCell>{customer.user.phone_number}</TableCell>
                    <TableCell>
                      {customer.services.map((service, index) => {
                        return service ? (
                          <Chip 
                            key={index}
                            label={service.service_name}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>
                      {customer.bookings.length}
                    </TableCell>
                    <TableCell>₦{customer.totalSpent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        </>
      );
        
};
