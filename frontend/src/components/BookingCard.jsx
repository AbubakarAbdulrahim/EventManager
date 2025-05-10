import React from 'react';
import { Box, Typography } from '@mui/material';
import { useBookingContext } from '../context/BookingsContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useServiceContext } from '../context/ServiceContext';
import { useNavigate } from 'react-router-dom';
import { useVendorContext } from '../context/VendorContext';
import { useSnackbar } from 'notistack';
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';
import { AlertTitle } from '@mui/material';
import { Button } from '@mui/material';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Table, { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


export default function BookingCard(params) {
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
            <Typography variant="h4">Booking Details</Typography>
            {/* Booking details content goes here */}
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Service</TableCell>
                            <TableCell align="right">Vendor</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key={bookingDetails.id}>
                            <TableCell component="th" scope="row">
                                {bookingDetails.serviceName}
                            </TableCell>
                            <TableCell align="right">{bookingDetails.vendorName}</TableCell>
                            <TableCell align="right">{bookingDetails.date}</TableCell>
                            <TableCell align="right">{bookingDetails.time}</TableCell>
                            <TableCell align="right">{bookingDetails.status}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/bookings')}>
                    Back to Bookings
                </Button>
            </Box>
            <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!enqueueSnackbar} autoHideDuration={6000} onClose={() => enqueueSnackbar(null)}>
                <Alert onClose={() => enqueueSnackbar(null)} severity="success" sx={{ width: '100%' }}>
                    <AlertTitle>Success</AlertTitle>
                    Booking details fetched successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
    
};
