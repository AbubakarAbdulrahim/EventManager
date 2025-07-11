
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
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Badge, 
  Menu, 
  MenuItem, 
  ThemeProvider, 
  createTheme,
  Tooltip
} from '@mui/material';
import { ListItemButton } from '@mui/material';
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
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import NotificationModal from './NotificationModal';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell, NotificationToasts } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';


export default function NavAppBar({currentPage, setCurrentPage}) {
    const theme = createTheme({
      palette: {
        primary: {
          main: '#033043',
        },
        secondary: {
          main: '#dc004e',
        },
      },
    });
    const [open, setOpen] = useState(false);
    const {logout} = useAuth()
    const navigate = useNavigate()
    const drawerWidth = open ? 240 : 60;
      
      const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
      const [accountAnchorEl, setAccountAnchorEl] = useState(null);
      const [tabValue, setTabValue] = useState(0);
      
    
      const handleNotificationsClick = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
      };
    
      const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
      };
    
      const handleAccountClick = (event) => {
        setAccountAnchorEl(event.currentTarget);
      };
    
      const handleAccountClose = () => {
        setAccountAnchorEl(null);
      };
    
      const handleDrawerOpen = () => {
        setOpen(true);
      };
    
      const handleDrawerClose = () => {
        setOpen(false);
      };
    
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    
      const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };
    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              transition: (theme) =>
                theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              ...(open && {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: (theme) =>
                  theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
              }),
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {currentPage} - Event Master Admin
              </Typography>
              <NotificationBell userRole='admin' />
              <IconButton color="inherit" onClick={handleAccountClick}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={accountAnchorEl}
                open={Boolean(accountAnchorEl)}
                onClose={handleAccountClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={()=>{navigate('/profile')}}>
                  <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleAccountClose}>
                  <Typography variant="body2">Account Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={()=>{logout()}}>
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              ...(open
                ? {}
                : {
                    overflowX: 'hidden',
                    transition: (theme) =>
                      theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                      }),
                    width: (theme) => theme.spacing(7),
                    [theme.breakpoints.up('sm')]: {
                      width: (theme) => theme.spacing(9),
                    },
                  }),
            },
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
              Admin Panel
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Dashboard')} selected={currentPage === 'Dashboard'}>
      <Tooltip title='Dashboard' >
        <ListItemIcon>
          <DashboardIcon color={currentPage === 'Dashboard' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Customers')} selected={currentPage === 'Customers'}>
      <Tooltip title='Customers' >
        <ListItemIcon>
          <PersonIcon color={currentPage === 'Customers' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Customers" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Vendors')} selected={currentPage === 'Vendors'}>
      <Tooltip title='Vendors' >
        <ListItemIcon>
          <PeopleIcon color={currentPage === 'Vendors' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Vendors" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Bookings')} selected={currentPage === 'Bookings'}>
      <Tooltip title='Bookings' >
        <ListItemIcon>
          <EventNoteIcon color={currentPage === 'Bookings' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Bookings" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Services')} selected={currentPage === 'Services'}>
      <Tooltip title='Services' >
        <ListItemIcon>
          <StoreIcon color={currentPage === 'Services' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Services" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Payments')} selected={currentPage === 'Payments'}>
      <Tooltip title='Payments' >
        <ListItemIcon>
          <PaymentIcon color={currentPage === 'Payments' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Payments" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Reports')} selected={currentPage === 'Reports'}>
      <Tooltip title='Reports' >
        <ListItemIcon>
          <BarChartIcon color={currentPage === 'Reports' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Reports" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Support')} selected={currentPage === 'Support'}>
      <Tooltip title='Support' >
        <ListItemIcon>
          <SupportAgentIcon color={currentPage === 'Support' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Support" />
    </ListItemButton>
  </ListItem>

  <ListItem disablePadding>
    <ListItemButton onClick={() => handlePageChange('Settings')} selected={currentPage === 'Settings'}>
      <Tooltip title='Settings' >
        <ListItemIcon>
          <SettingsIcon color={currentPage === 'Settings' ? 'primary' : 'inherit'} />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Settings" />
    </ListItemButton>
  </ListItem>
</List>
        </Drawer>
      </Box>
      <NotificationToasts/>
    </ThemeProvider>

    )

};
