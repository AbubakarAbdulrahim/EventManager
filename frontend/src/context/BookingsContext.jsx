import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const BookingsContext = createContext();

export const useBookingContext = () => {
    const context = useContext(BookingsContext);
    if (!context) {
        throw new Error('useBookingContext must be used within a BookingsProvider');
    }
    return context;
};

export const BookingsProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authAxios } = useAuth();
    
    // Load bookings from localStorage on mount
    useEffect(() => {
        try {
            const storedBookings = localStorage.getItem("bookings");
            if (storedBookings) {
                const parsedBookings = JSON.parse(storedBookings);
                // Validate that it's an array
                if (Array.isArray(parsedBookings)) {
                    setBookings(parsedBookings);
                }
            }
        } catch (error) {
            console.error("Error loading bookings from localStorage:", error);
            // Clear corrupted data
            localStorage.removeItem("bookings");
        }
    }, []);

    // Save bookings to localStorage whenever bookings change
    useEffect(() => {
        try {
            localStorage.setItem('bookings', JSON.stringify(bookings));
        } catch (error) {
            console.error("Error saving bookings to localStorage:", error);
        }
    }, [bookings]);

    const addBooking = useCallback((booking) => {
        if (!booking || typeof booking !== 'object' || !booking.id) {
            console.error("Invalid booking object provided to addBooking");
            return;
        }

        setBookings(prev => {
            const existingIndex = prev.findIndex(item => item.id === booking.id);
            
            if (existingIndex !== -1) {
                // Replace existing booking
                const updated = [...prev];
                updated[existingIndex] = booking;
                return updated;
            } else {
                // Add new booking
                return [...prev, booking];
            }
        });
    }, []);

    const cancelBooking = useCallback((bookingId) => {
        if (!bookingId) {
            console.error("Invalid bookingId provided to cancelBooking");
            return;
        }

        setBookings(prev => prev.filter(item => item.id !== bookingId));
    }, []);

    const isBooked = useCallback((serviceId) => {
        if (!serviceId) return false;
        return bookings.some(booking => booking.id === serviceId);
    }, [bookings]);

    const fetchUserBookings = useCallback(async () => {
        if (!authAxios) {
            setError("Authentication not available");
            return null;
        }

        setLoading(true);
        setError(null);
        
        try {
            const res = await authAxios.get('/bookings/user-bookings/');
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error("Error fetching user bookings:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch user bookings");
            setLoading(false);
            return null;
        }
    }, [authAxios]);

    const fetchVendorBookings = useCallback(async () => {
        if (!authAxios) {
            setError("Authentication not available");
            return null;
        }

        setLoading(true);
        setError(null);
        
        try {
            const res = await authAxios.get('/bookings/vendor-bookings/');
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error("Error fetching vendor bookings:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch vendor bookings");
            setLoading(false);
            return null;
        }
    }, [authAxios]);

    const fetchAllBookings = useCallback(async () => {
        if (!authAxios) {
            setError("Authentication not available");
            return null;
        }

        setLoading(true);
        setError(null);
        
        try {
            const res = await authAxios.get('/api-admin/bookings/');
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error("Error fetching all bookings:", err);
            setError(err.response?.data?.message || err.message || "Failed to fetch all bookings");
            setLoading(false);
            return null;
        }
    }, [authAxios]);

    // Clear bookings (useful for logout)
    const clearBookings = useCallback(() => {
        setBookings([]);
        localStorage.removeItem("bookings");
    }, []);

    // Sync bookings with server data
    const syncBookings = useCallback((serverBookings) => {
        if (Array.isArray(serverBookings)) {
            setBookings(serverBookings);
        }
    }, []);

    const value = {
        bookings,
        loading,
        error,
        addBooking,
        cancelBooking,
        isBooked,
        fetchUserBookings,
        fetchVendorBookings,
        fetchAllBookings,
        clearBookings,
        syncBookings,
    };

    return (
        <BookingsContext.Provider value={value}>
            {children}
        </BookingsContext.Provider>
    );
};