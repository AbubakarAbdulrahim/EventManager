import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Button, Chip, TextField, InputAdornment,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useBookingContext } from '../../context/BookingsContext';

export default function Bookings() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupBy, setGroupBy] = useState('None');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { fetchAllBookings } = useBookingContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await fetchAllBookings();
        setBookings(res);
      } catch (err) {
        console.error(err);
      }
      setLoading(false)
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const createdAt = new Date(b.created_at);
    const matchesFromDate = !fromDate || createdAt >= new Date(fromDate);
    const matchesToDate = !toDate || createdAt <= new Date(toDate);
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      b.id.toString().includes(search) ||
      b.user.full_name.toLowerCase().includes(search) ||
      b.vendor.business_name.toLowerCase().includes(search);
    return matchesStatus && matchesFromDate && matchesToDate && matchesSearch;
  });

  const groupBookings = (data) => {
    if (groupBy === 'None') return { 'All Bookings': data };
    return data.reduce((groups, booking) => {
      const key =
        groupBy === 'User'
          ? booking.user.full_name
          : groupBy === 'Vendor'
          ? booking.vendor.business_name
          : groupBy === 'Service'
          ? booking.service.service_name
          : 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(booking);
      return groups;
    }, {});
  };

  const grouped = groupBookings(filteredBookings);

  return (
    <Grid container spacing={3} padding={3} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
      {!loading ? <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h2" variant="h6" color="primary">
              Booking Management
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Create Booking
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Search"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, customer, or vendor"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <TextField
              label="From Date"
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Bookings</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Group By</InputLabel>
              <Select
                value={groupBy}
                label="Group By"
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="User">Grouped by Users</MenuItem>
                <MenuItem value="Vendor">Grouped by Vendors</MenuItem>
                <MenuItem value="Service">Grouped by Services</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(grouped).map(([groupName, groupBookings]) => (
                  <React.Fragment key={groupName}>
                    {groupBy !== 'None' && (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                            {groupBy}: {groupName}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {groupBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>{booking.user.full_name}</TableCell>
                        <TableCell>{booking.service.service_name}</TableCell>
                        <TableCell>{booking.vendor.business_name}</TableCell>
                        <TableCell>{formatDate(booking.created_at)}</TableCell>
                        <TableCell>{formatTime(booking.created_at)}</TableCell>
                        <TableCell align="right">₦{booking.total_price}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={
                              booking.status === 'Completed'
                                ? 'success'
                                : booking.status === 'Upcoming'
                                ? 'primary'
                                : booking.status === 'Pending'
                                ? 'warning'
                                : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button size="small" variant="outlined">
                              View
                            </Button>
                            {booking.status === 'Upcoming' && (
                              <Button size="small" variant="outlined" color="error">
                                Cancel
                              </Button>
                            )}
                            {booking.status === 'Completed' && (
                              <Button size="small" variant="outlined" color="secondary">
                                Invoice
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid> : <CircularProgress/>}
    </Grid>
  );
}
