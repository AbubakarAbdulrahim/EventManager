import { createContext, useState, useContext, useEffect } from "react";

const BookingsContext = createContext();

export const useBookingContext = () => useContext(BookingsContext);

export const BookingsProvider = ({children}) => {
    const [bookings, setBookings] = useState([]);

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
    


    const value = {
        bookings,
        addBooking,
        cancelBooking,
        isBooked,
    }

    return (
        <BookingsContext.Provider value={value}>
            {children}
        </BookingsContext.Provider>
    )
}
