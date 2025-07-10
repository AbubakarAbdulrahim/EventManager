import { useParams } from "react-router-dom";
import React from 'react';
import { useBookingContext } from '../../context/BookingsContext.jsx';
import { useAuth } from '../../context/AuthContext';
import { Box, duration, Typography } from '@mui/material';
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
    const { user, authAxios } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({
        id: '',
        serviceName: '',
        vendorName: '',
        date:'',
        startTime:'',
        endTime: '',
        duration:'',
        price:'',
        createdAt:'',
        status:'',

    });
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res =  await authAxios.get(`/bookings/${bookingId}/`)
                const data = res.data
                setBookingDetails({
                    id: data.id,
                    serviceName: data.service.service_name,
                    vendorName: data.vendor.business_name,
                    date: data.event_date,
                    startTime: data.start_time,
                    endTime: data.end_time,
                    duration: data.duration,
                    price: data.total_price,
                    // createdAt: data.created_at,
                    status: data.status,
                })
                console.log(res.data)

                 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookingId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log(bookingDetails);

    return (
        <Box sx={{ padding: 2, maxWidth: 500, margin: '0 auto', boxShadow: 3, borderRadius: 2, background: '#fff' }}>
            <Typography variant="h4" gutterBottom align="center">
                Booking Details
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1"><b>Service Name:</b> {bookingDetails.serviceName}</Typography>
                <Typography variant="subtitle1"><b>Vendor Name:</b> {bookingDetails.vendorName}</Typography>
                <Typography variant="subtitle1"><b>Date:</b> {bookingDetails.date}</Typography>
                <Typography variant="subtitle1"><b>Start Time:</b> {bookingDetails.startTime}</Typography>
                <Typography variant="subtitle1"><b>End Time:</b> {bookingDetails.endTime}</Typography>
                <Typography variant="subtitle1"><b>Duration:</b> {bookingDetails.duration}</Typography>
                <Typography variant="subtitle1"><b>Price:</b> ₦{bookingDetails.price}</Typography>
                {/* <Typography variant="subtitle1"><b>Created At:</b> {bookingDetails.createdAt}</Typography> */}
                <Typography variant="subtitle1"><b>Status:</b> {bookingDetails.status}</Typography>
            </Box>
        </Box>
    );


    
}
