import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useServiceContext } from '../../context/ServiceContext';
import { useBookingContext } from '../../context/BookingsContext';
import { useVendorContext } from '../../context/VendorContext';
import { useAuth } from '../../context/AuthContext';

const filterBookingsByPeriod = (bookings, period) => {
  const now = new Date();

  return bookings.filter(booking => {
    const bookingDate = new Date(booking.created_at);

    if (period === 'monthly') {
      return (
        bookingDate.getFullYear() === now.getFullYear() &&
        bookingDate.getMonth() === now.getMonth()
      );
    }

    if (period === 'quarterly') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const bookingQuarter = Math.floor(bookingDate.getMonth() / 3);
      return (
        bookingDate.getFullYear() === now.getFullYear() &&
        bookingQuarter === currentQuarter
      );
    }

    if (period === 'yearly') {
      return bookingDate.getFullYear() === now.getFullYear();
    }

    return true;
  });
};

const transformedData = (servicesData, bookings) => {
  const bookingCounts = {};

  bookings.forEach(booking => {
    const serviceId = booking.service.id;
    if (!bookingCounts[serviceId]) {
      bookingCounts[serviceId] = 0;
    }
    console.log('Booking Service ID:', serviceId, 'Count:', bookingCounts[serviceId], 'Booking:', booking);
    
    bookingCounts[serviceId]++;
  });

  return servicesData.map(service => {
    const price = service.pricing[0].base_price;
    const customerCount = bookingCounts[service.id] || 0;
    return {
      id: service.id,
      name: service.service_name,
      description: service.description,
      price,
      isActive: service.status,
      customers: customerCount,
      income: price * customerCount,
      service_images: service.service_images,
    };
  });
};

export default function Income() {
  const [period, setPeriod] = useState('monthly');
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { fetchServices } = useServiceContext();
  const { fetchVendors } = useVendorContext();
  const { fetchVendorBookings } = useBookingContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const vendors = await fetchVendors();
        const vendor = vendors.find(v => v.user.id === user.id);
        const vendorId = vendor?.id;

        const allServices = await fetchServices();
        const vendorServices = allServices.filter(s => s.vendor === vendorId);

        const allBookings = await fetchVendorBookings();
        const filteredBookings = filterBookingsByPeriod(allBookings, period);

        const transformedServices = transformedData(vendorServices, filteredBookings);

        const grouped = {};
        filteredBookings.forEach(booking => {
          const userId = booking.user.id;
          if (!grouped[userId]) {
            grouped[userId] = {
              user: booking.user,
              bookings: [],
            };
          }
          grouped[userId].bookings.push(booking.service);
        });

        setCustomers(Object.values(grouped));
        setServices(transformedServices);
      } catch (error) {
        console.error('Error fetching income data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (event, newValue) => {
    setPeriod(newValue);
  };

  const getTotalIncome = () => {
    return services.reduce((total, service) => total + service.income, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Income Tracking
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={period} onChange={handlePeriodChange}>
          <Tab value="monthly" label="Monthly" />
          <Tab value="quarterly" label="Quarterly" />
          <Tab value="yearly" label="Yearly" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Income Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">
                Total Revenue: ₦{getTotalIncome().toLocaleString()}
              </Typography>
              <Typography variant="body1">Services: {services.length}</Typography>
              <Typography variant="body1">Customers: {customers.length}</Typography>
            </Box>
          </Paper>

          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Customers</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>% of Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map(service => {
                    const percent = (service.income / getTotalIncome()) * 100;
                    return (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>₦{service.price}</TableCell>
                        <TableCell>{service.customers}</TableCell>
                        <TableCell>₦{service.income}</TableCell>
                        <TableCell>{percent.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Container>
  );
}
