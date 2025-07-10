import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  Container, 
  Grid, 
  Paper, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Badge, 
  Menu, 
  MenuItem, 
  ThemeProvider, 
  createTheme,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Avatar,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  BarChart as BarChartIcon,
  EventNote as EventNoteIcon,
  Store as StoreIcon,
  SupportAgent as SupportAgentIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  LocalOffer as LocalOfferIcon,
  Email as EmailIcon,
  Stars as StarsIcon,
  CalendarToday as CalendarTodayIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';

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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AccordionSummary, AccordionDetails} from '@mui/material';

export default function Settings() {
    const [currentTab, setCurrentTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setCurrentTab(newValue);
    };
  
    return (
      <Grid container spacing={3} padding={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs">
                <Tab label="Booking Policies" />
                <Tab label="Notification Templates" />
                <Tab label="System Settings" />
              </Tabs>
            </Box>
            
            {currentTab === 0 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>Booking Policies</Typography>
                
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Cancellation Policy</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Cancellation Policy Text"
                        defaultValue="Customers may cancel their booking up to 48 hours before the scheduled service time and receive a full refund. Cancellations made between 48 and 24 hours before the scheduled service time will receive a 50% refund. Cancellations made less than 24 hours before the scheduled service time will not be refunded."
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Full Refund Threshold (hours)"
                        type="number"
                        defaultValue="48"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Partial Refund Threshold (hours)"
                        type="number"
                        defaultValue="24"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Partial Refund Percentage"
                        type="number"
                        defaultValue="50"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Refund Policy</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Refund Policy Text"
                        defaultValue="Refunds will be processed within 7 business days after approval. All refunds will be issued to the original payment method. Disputes must be filed within 48 hours of service completion."
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Refund Processing Time (days)"
                        type="number"
                        defaultValue="7"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Dispute Filing Window (hours)"
                        type="number"
                        defaultValue="48"
                      />
                    </Grid>
                  </Grid>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Booking Policy</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Booking Policy Text"
                        defaultValue="Bookings must be made at least 24 hours in advance. Vendors have the right to accept or decline bookings based on availability. Payment is required at the time of booking to confirm reservation."
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Minimum Advance Booking Time (hours)"
                        type="number"
                        defaultValue="24"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Booking Confirmation Method</InputLabel>
                        <Select defaultValue="automatic" label="Booking Confirmation Method">
                          <MenuItem value="automatic">Automatic</MenuItem>
                          <MenuItem value="manual">Manual Vendor Approval</MenuItem>
                          <MenuItem value="adminReview">Admin Review</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" color="primary">
                    Save All Policy Changes
                  </Button>
                </Box>
              </Box>
            )}
            
            {currentTab === 1 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>Notification Templates</Typography>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Customer Booking Confirmation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Subject"
                          defaultValue="Your booking confirmation - {{booking_id}}"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          label="Email Body"
                          defaultValue="Dear {{customer_name}},
  
  Thank you for your booking with EventConnect! Your booking has been confirmed.
  
  Booking Details:
  - Booking ID: {{booking_id}}
  - Service: {{service_name}}
  - Date & Time: {{booking_date}} at {{booking_time}}
  - Vendor: {{vendor_name}}
  - Total Amount: {{amount}}
  
  If you have any questions, please don't hesitate to contact us.
  
  Best regards,
  The EventConnect Team"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="SMS Template"
                          defaultValue="EventConnect: Your booking #{{booking_id}} is confirmed for {{booking_date}}. View details in your account."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Send Email Notification"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Send SMS Notification"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Send In-App Notification"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Vendor Booking Notification</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Subject"
                          defaultValue="New booking request - {{booking_id}}"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          label="Email Body"
                          defaultValue="Dear {{vendor_name}},
  
  You have received a new booking request.
  
  Booking Details:
  - Booking ID: {{booking_id}}
  - Service: {{service_name}}
  - Date & Time: {{booking_date}} at {{booking_time}}
  - Customer: {{customer_name}}
  - Amount: {{amount}}
  
  Please log in to your vendor dashboard to accept or decline this booking.
  
  Best regards,
  The EventConnect Team"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="SMS Template"
                          defaultValue="EventConnect: New booking request #{{booking_id}} for {{booking_date}}. Log in to accept/decline."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Send Email Notification"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Send SMS Notification"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Send In-App Notification"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Booking Cancellation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Subject"
                          defaultValue="Booking cancellation - {{booking_id}}"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          label="Email Body"
                          defaultValue="Dear {{recipient_name}},
  
  A booking has been cancelled.
  
  Booking Details:
  - Booking ID: {{booking_id}}
  - Service: {{service_name}}
  - Date & Time: {{booking_date}} at {{booking_time}}
  - Cancellation Reason: {{cancellation_reason}}
  - Refund Amount: {{refund_amount}}
  
  For any questions, please contact our support team.
  
  Best regards,
  The EventConnect Team"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="SMS Template"
                          defaultValue="EventConnect: Booking #{{booking_id}} has been cancelled. {{refund_status}}"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Payment Reminder</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Subject"
                          defaultValue="Payment reminder for booking {{booking_id}}"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          label="Email Body"
                          defaultValue="Dear {{customer_name}},
  
  This is a reminder that payment for your upcoming booking is due.
  
  Booking Details:
  - Booking ID: {{booking_id}}
  - Service: {{service_name}}
  - Date & Time: {{booking_date}} at {{booking_time}}
  - Amount Due: {{amount_due}}
  - Due Date: {{due_date}}
  
  Please log in to your account to complete the payment.
  
  Best regards,
  The EventConnect Team"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="SMS Template"
                          defaultValue="EventConnect: Payment reminder for booking #{{booking_id}}. Amount due: {{amount_due}}. Please pay by {{due_date}}."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Reminder Schedule</InputLabel>
                          <Select defaultValue="7,3,1" label="Reminder Schedule">
                            <MenuItem value="7,3,1">7 days, 3 days, and 1 day before due date</MenuItem>
                            <MenuItem value="5,2">5 days and 2 days before due date</MenuItem>
                            <MenuItem value="3,1">3 days and 1 day before due date</MenuItem>
                            <MenuItem value="custom">Custom Schedule</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" color="primary">
                    Save All Templates
                  </Button>
                </Box>
              </Box>
            )}
            
            {currentTab === 2 && (
              <Box sx={{ p: 1 }}>
                <Typography variant="h6" gutterBottom>System Settings</Typography>
                
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>General Settings</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Platform Name"
                        defaultValue="EventConnect"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Support Email"
                        defaultValue="support@eventconnect.com"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Support Phone"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Default Language</InputLabel>
                        <Select defaultValue="en" label="Default Language">
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Default Currency</InputLabel>
                        <Select defaultValue="usd" label="Default Currency">
                          <MenuItem value="usd">USD ($)</MenuItem>
                          <MenuItem value="eur">EUR (€)</MenuItem>
                          <MenuItem value="gbp">GBP (£)</MenuItem>
                          <MenuItem value="cad">CAD ($)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Date Format</InputLabel>
                        <Select defaultValue="mdy" label="Date Format">
                          <MenuItem value="mdy">MM/DD/YYYY</MenuItem>
                          <MenuItem value="dmy">DD/MM/YYYY</MenuItem>
                          <MenuItem value="ymd">YYYY/MM/DD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Security Settings</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Session Timeout</InputLabel>
                        <Select defaultValue="30" label="Session Timeout">
                          <MenuItem value="15">15 minutes</MenuItem>
                          <MenuItem value="30">30 minutes</MenuItem>
                          <MenuItem value="60">1 hour</MenuItem>
                          <MenuItem value="120">2 hours</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Password Policy</InputLabel>
                        <Select defaultValue="strong" label="Password Policy">
                          <MenuItem value="basic">Basic (8+ characters)</MenuItem>
                          <MenuItem value="medium">Medium (8+ chars, must include numbers)</MenuItem>
                          <MenuItem value="strong">Strong (8+ chars, numbers, special chars)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable Two-Factor Authentication"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Auto-lock account after 5 failed login attempts"
                      />
                    </Grid>
                  </Grid>
                </Card>
                
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Integration Settings</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Gateway</InputLabel>
                        <Select defaultValue="stripe" label="Payment Gateway">
                          <MenuItem value="stripe">Stripe</MenuItem>
                          <MenuItem value="paypal">PayPal</MenuItem>
                          <MenuItem value="square">Square</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="API Key"
                        type="password"
                        defaultValue="sk_test_••••••••••••••••"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable Google Calendar Integration"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Enable SMS Notifications (Twilio)"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" startIcon={<RefreshIcon />}>
                        Test API Connections
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" color="primary">
                    Save System Settings
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }