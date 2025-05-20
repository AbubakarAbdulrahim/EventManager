import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const BookingsContext = createContext();

export const useBookingContext = () => useContext(BookingsContext);

export const BookingsProvider = ({children}) => {
    const [bookings, setBookings] = useState([]);
    const {authAxios} = useAuth()
    
    useEffect(() => {
        const storedBookings = localStorage.getItem("bookings")
        if(storedBookings) {
            setBookings(JSON.parse(storedBookings))
        }
    
    },[]);

    useEffect(()=>{
        localStorage.setItem('bookings', JSON.stringify(bookings))
    },[bookings]);

    const addBooking = (booking) => {
        const existingBooking = bookings.find(item => item.id === booking.id);  
        if(existingBooking) {
            setBookings(prev => prev.filter(item => item.id !== booking.id))
        }
        else {
            setBookings(prev => [...prev, booking])
        }
        // setBookings((prev) => [...prev, booking.id])
    }

    const cancelBooking = (bookingId) => {
        setBookings(prev => prev.filter(item => item.id !== bookingId))
    }

    const isBooked = (serviceId) => bookings.some(booking => booking.id === serviceId);

    const fetchUserBookings = async() => {
        try{
            const res = await authAxios.get('/bookings/user-bookings/')
            return res.data
        } catch(err){
            console.error(err);
        }
    }
    const fetchVendorBookings = async() => {
        try{
            const res = await authAxios.get('/bookings/vendor-bookings/')
            return res.data
        } catch(err){
            console.error(err);
        }
    }

    const fetchAllBookings = async() =>{
        try{
            const res = await authAxios.get('/api-admin/bookings/')
            return res.data
        } catch(err){
            console.error(err);
        }

    }
    


    const value = {
        bookings,
        addBooking,
        cancelBooking,
        isBooked,
        fetchUserBookings,
        fetchVendorBookings,
        fetchAllBookings,
    }

    return (
        <BookingsContext.Provider value={value}>
            {children}
        </BookingsContext.Provider>
    )
}
