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


const transactions = [
    { id: 'TR001', booking: 'BK001', customer: 'John Doe', vendor: 'ProShots Inc.', amount: 1200, fee: 60, vendorAmount: 1140, date: '2025-04-22', status: 'Completed' },
    { id: 'TR002', booking: 'BK002', customer: 'Jane Smith', vendor: 'Delicious Foods', amount: 2500, fee: 125, vendorAmount: 2375, date: '2025-04-23', status: 'Pending' },
    { id: 'TR003', booking: 'BK003', customer: 'Mike Johnson', vendor: 'Grand Ballroom', amount: 5000, fee: 250, vendorAmount: 4750, date: '2025-04-25', status: 'Pending' },
    { id: 'TR004', booking: 'BK004', customer: 'Sarah Williams', vendor: 'Beat Masters', amount: 800, fee: 40, vendorAmount: 760, date: '2025-04-20', status: 'Completed' },
    { id: 'TR005', booking: 'BK005', customer: 'Robert Brown', vendor: 'Elegant Designs', amount: 1500, fee: 75, vendorAmount: 0, date: '2025-04-24', status: 'Refunded' },
  ];

export default function Payments() {
    const [tabValue, setTabValue] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
  
    return (
      <Grid container spacing={3} padding={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="payment management tabs">
                <Tab label="Transactions" />
                <Tab label="Vendor Payouts" />
                <Tab label="Refunds" />
                <Tab label="Settings" />
              </Tabs>
            </Box>
            
            {tabValue === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Transaction History
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="From Date"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="To Date"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="contained" startIcon={<RefreshIcon />}>
                      Filter
                    </Button>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Booking</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Vendor</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Fee</TableCell>
                        <TableCell align="right">Vendor Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.booking}</TableCell>
                          <TableCell>{transaction.customer}</TableCell>
                          <TableCell>{transaction.vendor}</TableCell>
                          <TableCell align="right">${transaction.amount}</TableCell>
                          <TableCell align="right">${transaction.fee}</TableCell>
                          <TableCell align="right">${transaction.vendorAmount}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Chip 
                              label={transaction.status} 
                              color={
                                transaction.status === 'Completed' ? 'success' : 
                                transaction.status === 'Pending' ? 'warning' : 'error'
                              } 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            
            {tabValue === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Vendor Payouts
                  </Typography>
                  <Button variant="contained" startIcon={<AttachMoneyIcon />}>
                    Process Payouts
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Vendor</TableCell>
                        <TableCell align="right">Pending Amount</TableCell>
                        <TableCell>Last Payout</TableCell>
                        <TableCell>Payout Method</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>ProShots Inc.</TableCell>
                        <TableCell align="right">$3,420</TableCell>
                        <TableCell>2025-04-10</TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">Process</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Delicious Foods</TableCell>
                        <TableCell align="right">$7,125</TableCell>
                        <TableCell>2025-04-05</TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">Process</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Grand Ballroom</TableCell>
                        <TableCell align="right">$14,250</TableCell>
                        <TableCell>2025-03-28</TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">Process</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Beat Masters</TableCell>
                        <TableCell align="right">$2,280</TableCell>
                        <TableCell>2025-04-12</TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell align="center">
                        <Button size="small" variant="outlined">Process</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            
            {tabValue === 2 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Refund Management
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Search refunds..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Request Date</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>BK005</TableCell>
                        <TableCell>Robert Brown</TableCell>
                        <TableCell>Wedding Decor Package</TableCell>
                        <TableCell>2025-04-24</TableCell>
                        <TableCell align="right">$1,500</TableCell>
                        <TableCell>Cancellation</TableCell>
                        <TableCell>
                          <Chip label="Completed" color="success" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>BK008</TableCell>
                        <TableCell>Lisa Miller</TableCell>
                        <TableCell>DJ Services</TableCell>
                        <TableCell>2025-04-22</TableCell>
                        <TableCell align="right">$800</TableCell>
                        <TableCell>Service issue</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="warning" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            <Button size="small" variant="outlined" color="success">Approve</Button>
                            <Button size="small" variant="outlined" color="error">Reject</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            
            {tabValue === 3 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Payment & Commission Settings</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Platform Commission Rates</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                              label="Platform Commission Rate (%)"
                              type="number"
                              defaultValue="5"
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>Category-Specific Rates</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField fullWidth label="Photography" defaultValue="5" InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }} />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField fullWidth label="Catering" defaultValue="4" InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }} />
                        </Grid>
                        <Grid item xs={8}>
                          <TextField fullWidth label="Venues" defaultValue="3" InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }} />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Button variant="contained">Save Changes</Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Payout Settings</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Default Payout Schedule</InputLabel>
                            <Select defaultValue="biweekly" label="Default Payout Schedule">
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="biweekly">Bi-weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                              label="Minimum Payout Amount"
                              type="number"
                              defaultValue="100"
                              InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Enable automatic payouts"
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Button variant="contained">Save Changes</Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }