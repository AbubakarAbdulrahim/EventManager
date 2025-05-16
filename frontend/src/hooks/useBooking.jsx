import { useState, useEffect } from 'react';
import { useBookingContext } from '../context/BookingsContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useServiceContext } from '../context/ServiceContext';
import { useVendorContext } from '../context/VendorContext';

export default function useBooking(params) {
    const { bookingId } = params;
    const { getBookingById, bookingDetails, setBookingDetails } = useBookingContext();
    const { getServiceById } = useServiceContext();
    const { getVendorById } = useVendorContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
    
    return { bookingDetails, loading, error };
    
};
