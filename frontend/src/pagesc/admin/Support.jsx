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



export default function Support() {
    const [tabValue, setTabValue] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
  
    return (
      <Grid container spacing={3} padding={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="support management tabs">
                <Tab label="Support Tickets" />
                <Tab label="Disputes" />
                <Tab label="Chat Logs" />
              </Tabs>
            </Box>
            
            {tabValue === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Customer Support Tickets
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Status</InputLabel>
                      <Select defaultValue="open" label="Status">
                        <MenuItem value="all">All Tickets</MenuItem>
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="inprogress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      placeholder="Search tickets..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ticket ID</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>TKT1234</TableCell>
                        <TableCell>Refund request for booking</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>2025-04-20</TableCell>
                        <TableCell>2025-04-21</TableCell>
                        <TableCell>
                          <Chip label="High" color="error" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label="Open" color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            <Button size="small" variant="outlined" color="success">Respond</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>TKT1235</TableCell>
                        <TableCell>Vendor not responding</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>2025-04-19</TableCell>
                        <TableCell>2025-04-22</TableCell>
                        <TableCell>
                          <Chip label="Medium" color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label="In Progress" color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            <Button size="small" variant="outlined" color="success">Respond</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>TKT1236</TableCell>
                        <TableCell>Account verification issue</TableCell>
                        <TableCell>Mike Johnson</TableCell>
                        <TableCell>2025-04-18</TableCell>
                        <TableCell>2025-04-21</TableCell>
                        <TableCell>
                          <Chip label="Low" color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip label="Resolved" color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            
            {tabValue === 1 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography component="h2" variant="h6" color="primary">
                    Dispute Management
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select defaultValue="open" label="Status">
                      <MenuItem value="all">All Disputes</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="inprogress">In Mediation</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Dispute ID</TableCell>
                        <TableCell>Booking</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Filed On</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>DIS001</TableCell>
                        <TableCell>BK008</TableCell>
                        <TableCell>Lisa Miller</TableCell>
                        <TableCell>Beat Masters</TableCell>
                        <TableCell>2025-04-22</TableCell>
                        <TableCell>Service quality issue</TableCell>
                        <TableCell>
                          <Chip label="Open" color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            <Button size="small" variant="outlined" color="primary">Mediate</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>DIS002</TableCell>
                        <TableCell>BK012</TableCell>
                        <TableCell>Tom Wilson</TableCell>
                        <TableCell>Delicious Foods</TableCell>
                        <TableCell>2025-04-18</TableCell>
                        <TableCell>Late delivery</TableCell>
                        <TableCell>
                          <Chip label="In Mediation" color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" variant="outlined">View</Button>
                            <Button size="small" variant="outlined" color="success">Resolve</Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>DIS003</TableCell>
                        <TableCell>BK010</TableCell>
                        <TableCell>Sarah Williams</TableCell>
                        <TableCell>ProShots Inc.</TableCell>
                        <TableCell>2025-04-15</TableCell>
                        <TableCell>Photo quality issue</TableCell>
                        <TableCell>
                          <Chip label="Resolved" color="success" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View</Button>
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
                    Customer/Vendor Communication Logs
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
                    <Button variant="contained" startIcon={<SearchIcon />}>
                      Search
                    </Button>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Conversation ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Related Booking</TableCell>
                        <TableCell>Started</TableCell>
                        <TableCell>Last Message</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>CONV124</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>ProShots Inc.</TableCell>
                        <TableCell>BK001</TableCell>
                        <TableCell>2025-04-15</TableCell>
                        <TableCell>2025-04-22</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View Chat</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CONV125</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>Delicious Foods</TableCell>
                        <TableCell>BK002</TableCell>
                        <TableCell>2025-04-18</TableCell>
                        <TableCell>2025-04-23</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View Chat</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CONV126</TableCell>
                        <TableCell>Mike Johnson</TableCell>
                        <TableCell>Grand Ballroom</TableCell>
                        <TableCell>BK003</TableCell>
                        <TableCell>2025-04-20</TableCell>
                        <TableCell>2025-04-22</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View Chat</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }