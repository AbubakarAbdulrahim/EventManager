import { useParams } from "react-router-dom";
import React from 'react';
import { useBookingContext } from '../../context/BookingsContext.jsx';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useServiceContext } from '../../context/ServiceContext';
import BookingCard from '../../components/BookingCard.jsx';
import { useNavigate } from 'react-router-dom';
import { useVendorContext } from '../../context/VendorContext';

import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';
import { AlertTitle } from '@mui/material';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';


export default function BookingDetails() {
    const { bookingId } = useParams();
    const { getBookingById, bookingDetails, setBookingDetails } = useBookingContext();
    const { getServiceById } = useServiceContext();
    const { getVendorById } = useVendorContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = () => {
            try {
                setLoading(true);
                const res=  bookingDetails
                console.log(res)

                 getBookingById(bookingId);
                 getServiceById(bookingDetails.id);
                 getVendorById(bookingDetails.vendorId);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookingId, getBookingById, getServiceById, getVendorById]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Booking Details
            </Typography>
            <BookingCard booking={bookingDetails} />
        </Box>
    );


    
}
