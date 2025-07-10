import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Card, 
  CardContent, 
  CardHeader
} from '@mui/material';

import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

// Chart components
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { useBookingContext } from '../../context/BookingsContext';
import { useVendorContext } from '../../context/VendorContext';
import { useUserContext } from '../../context/UserContext';
import { useServiceContext } from '../../context/ServiceContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#0a7273', '#fda521', '#82ca9d', '#ff8042', '#a4de6c'];

export default function Reports() {
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const { fetchAllBookings } = useBookingContext();
  const { fetchVendors } = useVendorContext();
  const { fetchUsers } = useUserContext();
  const { fetchServices } = useServiceContext();
  const [bookings, setBookings] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingTypeData, setBookingTypeData] = useState([]);
  const [customerGrowthData, setCustomerGrowthData] = useState([]);
  const [vendorGrowthData, setVendorGrowthData] = useState([]);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const reportRef = useRef(null);
  const [advancedMetrics, setAdvancedMetrics] = useState({
    avgTimeBetweenBookings: 0,
    repeatBookingRate: 0,
    avgSpendPerCustomer: 0,
    topVendorCategory: '',
    avgVendorRating: 0,
    vendorRetentionRate: 0,
    peakBookingDay: '',
    peakBookingTime: '',
    peakBookingMonth: '',
  });
  
  // Get dates for different periods
  const getPeriodStartDate = (period) => {
    const now = new Date();
    switch (period) {
      case 'daily':
        return new Date(now.setDate(now.getDate() - 14)); // Last 14 days
      case 'weekly':
        return new Date(now.setDate(now.getDate() - 84)); // Last 12 weeks
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() - 12)); // Last 12 months
      case 'quarterly':
        return new Date(now.setMonth(now.getMonth() - 24)); // Last 8 quarters
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
      default:
        return new Date(now.setMonth(now.getMonth() - 12)); // Default to monthly
    }
  };

  // Format date according to period
  const formatDateForPeriod = (date, period) => {
    const d = new Date(date);
    switch (period) {
      case 'daily':
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        // Get week number and year
        const weekNumber = getWeekNumber(d);
        return `W${weekNumber} ${d.getFullYear()}`;
      case 'monthly':
        return d.toLocaleString('default', { month: 'short', year: '2-digit' });
      case 'quarterly':
        const quarter = Math.floor(d.getMonth() / 3) + 1;
        return `Q${quarter} ${d.getFullYear()}`;
      case 'yearly':
        return d.getFullYear().toString();
      default:
        return d.toLocaleString('default', { month: 'short' });
    }
  };

  // Helper to get week number
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Filter data based on time period
  const filterDataByPeriod = (data, period, dateField = 'created_at') => {
    const startDate = getPeriodStartDate(period);
    return data.filter(item => new Date(item[dateField] ?? item.date_joined) >= startDate);
  };

  // Group data for the selected period
  const groupDataByPeriod = (data, period, dateField = 'created_at', valueField = 'total_price') => {
    const groupedData = {};
    
    data.forEach(item => {
      const date = new Date(item[dateField] ?? item.date_joined);
      const formattedDate = formatDateForPeriod(date, period);
      
      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = {
          period: formattedDate,
          revenue: 0,
          bookings: 0,
          count: 0
        };
      }
      
      // If the item has total_price, add it to revenue
      if (item[valueField]) {
        groupedData[formattedDate].revenue += parseFloat(item[valueField]);
      }
      
      groupedData[formattedDate].bookings += 1;
      groupedData[formattedDate].count += 1;
    });
    
    // Convert to array and sort chronologically
    return Object.values(groupedData).sort((a, b) => {
      if (period === 'daily') {
        const [monthA, dayA] = a.period.split(' ');
        const [monthB, dayB] = b.period.split(' ');
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (monthA !== monthB) {
          return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        }
        return parseInt(dayA) - parseInt(dayB);
      }
      
      if (period === 'weekly') {
        const [weekA, yearA] = a.period.split(' ');
        const [weekB, yearB] = b.period.split(' ');
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }
        return parseInt(weekA.substring(1)) - parseInt(weekB.substring(1));
      }
      
      if (period === 'monthly') {
        const [monthA, yearA] = a.period.split(' ');
        const [monthB, yearB] = b.period.split(' ');
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
      }
      
      if (period === 'quarterly') {
        const [quarterA, yearA] = a.period.split(' ');
        const [quarterB, yearB] = b.period.split(' ');
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }
        return parseInt(quarterA.substring(1)) - parseInt(quarterB.substring(1));
      }
      
      // For yearly or any other period
      return a.period.localeCompare(b.period);
    });
  };

  // Get booking type data
  const getBookingTypeData = (bookings) => {
    const typeCounts = {};
    bookings.forEach(({ service }) => {
      if (!service?.service_type) return;
      typeCounts[service.service_type] = (typeCounts[service.service_type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  };

  // Compute advanced analytics
  const computeAdvancedAnalytics = (bookings, vendors) => {
    const customerBookings = {};
    const customerSpend = {};
    const vendorRatings = vendors.map(v => v.rating).filter(Boolean);
    const vendorJoinDates = vendors.map(v => new Date(v.date_joined));

    const bookingDates = bookings.map(b => new Date(b.created_at)).sort((a, b) => a - b);
    const dayCounts = {};
    const timeCounts = {};
    const monthCounts = {};
    const vendorRevenue = {};

    bookings.forEach((b) => {
      const customerId = b.user?.id;
      const vendorCategory = b.service?.service_type;
      const vendorId = b.vendor?.id;
      const createdAt = new Date(b.created_at);

      // Track repeat bookings
      if (customerId) {
        customerBookings[customerId] = (customerBookings[customerId] || 0) + 1;
        customerSpend[customerId] = (customerSpend[customerId] || 0) + parseFloat(b.total_price);
      }

      // Track peak day/time/month
      const weekday = createdAt.toLocaleString('default', { weekday: 'long' });
      const hour = createdAt.getHours();
      const month = createdAt.toLocaleString('default', { month: 'long' });

      dayCounts[weekday] = (dayCounts[weekday] || 0) + 1;
      timeCounts[hour] = (timeCounts[hour] || 0) + 1;
      monthCounts[month] = (monthCounts[month] || 0) + 1;

      // Vendor revenue
      if (vendorCategory) {
        vendorRevenue[vendorCategory] = (vendorRevenue[vendorCategory] || 0) + parseFloat(b.total_price);
      }
    });

    const repeatCustomers = Object.values(customerBookings).filter(b => b > 1).length;
    const avgSpend = Object.values(customerSpend).reduce((a, b) => a + b, 0) / Math.max(Object.keys(customerSpend).length, 1);
    const avgTime = (bookingDates.length >= 2)
      ? (bookingDates[bookingDates.length - 1] - bookingDates[0]) / (bookingDates.length - 1) / (1000 * 60 * 60 * 24)
      : 0;

    const topCategory = Object.entries(vendorRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const topTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const topMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    return {
      avgTimeBetweenBookings: Math.round(avgTime),
      repeatBookingRate: Math.round((repeatCustomers / Math.max(Object.keys(customerBookings).length, 1)) * 100),
      avgSpendPerCustomer: avgSpend.toFixed(2),
      topVendorCategory: topCategory,
      avgVendorRating: (vendorRatings.reduce((a, b) => a + b, 0) / Math.max(vendorRatings.length, 1)).toFixed(1),
      vendorRetentionRate: '92', // For simplicity, hardcoded or add logic
      peakBookingDay: topDay,
      peakBookingTime: `${topTime}:00 - ${(+topTime + 2)}:00`,
      peakBookingMonth: topMonth
    };
  };

  // Update reports when period changes
  const updateReports = () => {
    if (!bookings.length || !vendors.length || !users.length) return;
    
    const filteredBookings = filterDataByPeriod(bookings, reportPeriod);
    const filteredVendors = filterDataByPeriod(vendors, reportPeriod, 'created_at');
    const filteredUsers = filterDataByPeriod(users, reportPeriod, 'date_joined');
    
    // Update revenue and booking data
    const periodRevenueData = groupDataByPeriod(filteredBookings, reportPeriod);
    setRevenueData(periodRevenueData);
    
    // Update booking type data
    setBookingTypeData(getBookingTypeData(filteredBookings));
    
    // Update growth data
    setCustomerGrowthData(groupDataByPeriod(filteredUsers, reportPeriod, 'date_joined'));
    setVendorGrowthData(groupDataByPeriod(filteredVendors, reportPeriod, 'created_at'));
    
    // Update advanced metrics
    const analytics = computeAdvancedAnalytics(filteredBookings, filteredVendors);
    setAdvancedMetrics(analytics);
  };

  // Generate PDF report
  const generatePDFReport = async () => {
    if (!reportRef.current) return;
    
    try {
      setPdfGenerating(true);
      
      // Format date for filename
      const dateStr = new Date().toISOString().split('T')[0];
      const periodStr = reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1);
      const fileName = `BookingReport_${periodStr}_${dateStr}.pdf`;
      
      // Create new PDF document (A4 landscape)
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      // Add title and date
      pdf.setFontSize(18);
      pdf.text(`Booking System ${periodStr} Report`, 14, 15);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 23);
      pdf.text(`Reporting Period: ${periodStr}`, 14, 30);
      
      // Capture each section of the report individually
      const reportElement = reportRef.current;
      
      // Capture the revenue report section
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Add the canvas as an image to the PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 270; // A4 landscape width (297mm) minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image, handle multiple pages if needed
      let position = 40; // Start position after title
      pdf.addImage(imgData, 'PNG', 14, position, imgWidth, imgHeight);
      
      // Add summary of advanced metrics to the last page
      const metricsPosition = position + imgHeight + 10;
      if (metricsPosition > 200) { // If we're near the bottom of the page, add a new page
        pdf.addPage();
        position = 15;
      } else {
        position = metricsPosition;
      }
      
      // Add summary of key metrics
      pdf.setFontSize(14);
      pdf.text('Key Performance Summary', 14, position);
      pdf.setFontSize(10);
      
      position += 10;
      pdf.text(`• Revenue: ₦${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`, 18, position);
      
      position += 6;
      pdf.text(`• Total Bookings: ${revenueData.reduce((sum, item) => sum + item.bookings, 0)}`, 18, position);
      
      position += 6;
      pdf.text(`• Average Spend per Customer: ₦${parseFloat(advancedMetrics.avgSpendPerCustomer).toLocaleString()}`, 18, position);
      
      position += 6;
      pdf.text(`• Repeat Booking Rate: ${advancedMetrics.repeatBookingRate}%`, 18, position);
      
      position += 6;
      pdf.text(`• Top Performing Category: ${advancedMetrics.topVendorCategory || 'N/A'}`, 18, position);
      
      position += 6;
      pdf.text(`• Peak Booking Day: ${advancedMetrics.peakBookingDay || 'N/A'}`, 18, position);
      
      position += 6;
      pdf.text(`• Peak Booking Time: ${advancedMetrics.peakBookingTime || 'N/A'}`, 18, position);
      
      // Add footnote
      pdf.setFontSize(8);
      pdf.text(`This is an automatically generated report. For questions, contact admin@bookingservice.com`, 14, 200);
      
      // Save the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allBookings = await fetchAllBookings();
        const allVendors = await fetchVendors();
        const allUsers = await fetchUsers();
        
        setBookings(allBookings);
        setVendors(allVendors);
        setUsers(allUsers);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update reports when data changes or period changes
  useEffect(() => {
    updateReports();
  }, [bookings, vendors, users, reportPeriod]);

  // Handle period change
  const handlePeriodChange = (event) => {
    setReportPeriod(event.target.value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    updateReports();
  };

  // Get appropriate x-axis label based on period
  const getXAxisLabel = () => {
    switch (reportPeriod) {
      case 'daily': return 'Day';
      case 'weekly': return 'Week';
      case 'monthly': return 'Month';
      case 'quarterly': return 'Quarter';
      case 'yearly': return 'Year';
      default: return 'Period';
    }
  };

  // Get period name for PDF title
  const getPeriodDisplayName = () => {
    switch (reportPeriod) {
      case 'daily': return 'Daily Report (Last 14 Days)';
      case 'weekly': return 'Weekly Report (Last 12 Weeks)';
      case 'monthly': return 'Monthly Report (Last 12 Months)';
      case 'quarterly': return 'Quarterly Report (Last 8 Quarters)';
      case 'yearly': return 'Yearly Report (Last 5 Years)';
      default: return 'Booking Report';
    }
  };

  return (
    <Grid container spacing={3} padding={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h2" variant="h6" color="primary">
              Revenue & Booking Reports
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={reportPeriod}
                  label="Time Period"
                  onChange={handlePeriodChange}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />} 
                onClick={handleRefresh}
              >
                Refresh Data
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<DownloadIcon />} 
                onClick={generatePDFReport}
                disabled={pdfGenerating || loading}
              >
                {pdfGenerating ? 'Generating PDF...' : 'Generate PDF Report'}
              </Button>
            </Box>
          </Box>
          
          {loading ? (
            <Typography>Loading reports...</Typography>
          ) : (
            <Box id="report" ref={reportRef} sx={{ p: 3, backgroundColor: 'white' }}>
              <Typography variant="h5" gutterBottom align="center">
                {getPeriodDisplayName()}
              </Typography>
              <Typography variant="subtitle2" gutterBottom align="center" color="textSecondary">
                Generated on: {new Date().toLocaleDateString()}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom>Revenue Trend</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" label={{ value: getXAxisLabel(), position: 'insideBottomRight', offset: -5 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#033043" name="Revenue (₦)" />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>Booking Types</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bookingTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#033043"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {bookingTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Booking Trends</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" label={{ value: getXAxisLabel(), position: 'insideBottomRight', offset: -5 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bookings" fill="#82ca9d" name="Number of Bookings" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Growth Metrics
          </Typography>
          {loading ? (
            <Typography>Loading growth metrics...</Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Customer Growth</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" label={{ value: getXAxisLabel(), position: 'insideBottomRight', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="count" stroke="#033043" name="New Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Vendor Growth</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={vendorGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" label={{ value: getXAxisLabel(), position: 'insideBottomRight', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="count" stroke="#82ca9d" name="New Vendors" />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Advanced Analytics
          </Typography>
          {loading ? (
            <Typography>Loading analytics...</Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardHeader title="Customer Behavior" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Average Time Between Bookings
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.avgTimeBetweenBookings} days</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Repeat Booking Rate
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.repeatBookingRate}%</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Average Spend per Customer
                    </Typography>
                    <Typography variant="h6">₦{parseFloat(advancedMetrics.avgSpendPerCustomer).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardHeader title="Vendor Performance" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Top Performing Vendor Category
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.topVendorCategory || 'N/A'}</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Average Vendor Rating
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.avgVendorRating}/5.0</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Vendor Retention Rate
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.vendorRetentionRate}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardHeader title="Peak Booking Analysis" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Peak Booking Day
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.peakBookingDay || 'N/A'}</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Peak Booking Time
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.peakBookingTime || 'N/A'}</Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
                      Peak Booking Month
                    </Typography>
                    <Typography variant="h6">{advancedMetrics.peakBookingMonth || 'N/A'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}