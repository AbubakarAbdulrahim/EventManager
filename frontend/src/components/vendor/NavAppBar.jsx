
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
  // Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  // Dashboard as DashboardIcon,
  // Person as PersonIcon,
  People as PeopleIcon,
  // Settings as SettingsIcon,
  Payment as PaymentIcon,
  BarChart as BarChartIcon,
  EventNote as EventNoteIcon,
  Store as StoreIcon,
  SupportAgent as SupportAgentIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import NotificationModal from './NotificationModal';
import { 
  Dashboard as DashboardIcon, AddCircle, Delete, Edit, Visibility, 
  VisibilityOff, Person, Business, AttachMoney, Settings as SettingsIcon, 
  Logout, Menu as MenuIcon, Search, CheckCircle, Cancel, Star
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
  { text: 'Services', icon: <Business />, page: 'services' },
  { text: 'Customers', icon: <Person />, page: 'customers' },
  { text: 'Income', icon: <AttachMoney />, page: 'income' },
  { text: 'Settings', icon: <SettingsIcon />, page: 'settings' },
];



export default function NavAppBar({currentPage, setCurrentPage}) {
    const [open, setOpen] = useState(false);
    const drawerWidth = open ? 240 : 60;
    const { logout } = useAuth();
      
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

      const drawer = (
        <div>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Vendor Dashboard
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            {drawerItems.map((item) => (
              <ListItemButton 
                
                key={item.text}
                selected={currentPage === item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  // setMobileOpen(false);
                }}
              >
                <Tooltip title={item.text}>              
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={()=>{logout()}} >
              <Tooltip title='Logout'>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </div>
      );
      
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
                {drawerItems.map((page)=> (page.text).toLocaleLowerCase() === currentPage ? page.text : '')} - Event Master Vendor
              </Typography>
              <IconButton color="inherit" onClick={handleNotificationsClick}>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <NotificationModal notificationsAnchorEl={notificationsAnchorEl} handleNotificationsClose={handleNotificationsClose} />
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
                <MenuItem onClick={handleAccountClose}>
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
         {drawer}
        </Drawer>
      </Box>
    </ThemeProvider>

    )

};
