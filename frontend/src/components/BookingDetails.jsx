import React from 'react';
import { useBookingContext } from '../context/BookingsContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useServiceContext } from '../context/ServiceContext';
import BookingCard from './BookingCard.jsx';
import { useNavigate } from 'react-router-dom';
import { useVendorContext } from '../context/VendorContext';
import { useSnackbar } from 'notistack';
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';
import { AlertTitle } from '@mui/material';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useBooking } from '../hooks/useBooking';
import { useService } from '../hooks/useService';
import { useVendor } from '../hooks/useVendor';
import { useCustomer } from '../hooks/useCustomer';
import { useEvent } from '../hooks/useEvent';
import { useEventBooking } from '../hooks/useEventBooking';
import { useEventBookingContext } from '../context/EventBookingContext';
import { useEventContext } from '../context/EventContext';

export default function BookingDetails() {
    const { bookingId } = useParams();
    const { getBookingById, bookingDetails, setBookingDetails } = useBookingContext();
    const { getServiceById } = useServiceContext();
    const { getVendorById } = useVendorContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await getBookingById(bookingId);
                await getServiceById(bookingDetails.serviceId);
                await getVendorById(bookingDetails.vendorId);
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
    
};
