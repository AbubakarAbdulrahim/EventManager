import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { Tooltip } from '@mui/material';
import { Avatar, Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Person } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const navItems = ['Home', "Bookings", 'Favorites', 'History', 'Profile', 'About'];
const settings = ['Profile', 'Become a vendor', 'Account', 'Dashboard', 'Logout'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const {logout} = useAuth()
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleProfile = (setting) => {
    switch(setting){
      case 'Account':
        setProfileOpen(true)
        break;
      case 'Logout':
        logout();
        break;
      case 'Become a vendor':
        navigate('/apply')
        break;
      default:
        console.log('Navigating to:', setting);
    }
    
  }

  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: '#0984e3',
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(2)
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: 0,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  

  const drawer = (
    <Box sx={{ textAlign: 'center', backgroundColor: '#033043', color: '#fff', flexGrow: 1, px:3 }}>
      <Typography variant="h6" sx={{ my: 2}}>
        EventMaster 
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center', textTransform:'none' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{display: { xs: 'flex', md: 'none' },
        position: 'relative',
        borderRadius: "4px",
        px:'5px',
        color:'#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
        },
        marginLeft: 0,
        maxWidth: '100%',
      }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <InputBase
      sx={{marginLeft:3,
      color: 'inherit',
      width: '100%',
      '& .MuiInputBase-input': {
              padding: 1,}
      }}
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => {props.setSearchTerm(e.target.value); setSearchTerm(e.target.value)}}
        value={searchTerm}
      />
    </Box>
    </Box>
  );


  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <AppBar sx={{backgroundColor: "#033043"}} position="sticky">
        <Toolbar>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1,}}>
            <img src="/EventMaster.png" height={30} width={30}/>
          {/* <img src="/logo.png" height={30} width={30}/> */}
          </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              EventMaster
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, flexGrow: 1, justifyContent: 'start' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1,}}>
          {/* <img src="/EventMaster.png" height={30} width={30}/> */}
            <img src="/EventMaster.png" height={30} width={30}/>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              // justifyContent: 'center',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            EventMaster
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button 
                LinkComponent={item !== 'Profile' && Link}
                to={(item ==='Home' ? "/dashboard" : "/" + item.toLowerCase())}
                onClick={item === 'Profile' && handleOpenUserMenu} key={item} sx={{ fontSize:'1em', color: '#fff', textTransform:'none'}}>
                {item}
              </Button>
            ))}
          </Box>
          <Box sx={{display: { xs: 'none', md: 'flex' },
              position: 'relative',
              borderRadius: "4px",
              px:'5px',
              color:'#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
              },
              marginLeft: 0,
              maxWidth: '100%',
           }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <InputBase
            sx={{marginLeft:2,
            color: 'inherit',
            '& .MuiInputBase-input': {
              padding: 1,
              transition: "width .2s ease",
              width: '12ch',
              '&:focus': {
                  width: '20ch',
                },
              },
            }}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => {props.setSearchTerm(e.target.value); setSearchTerm(e.target.value)}}
              value={searchTerm}
            />
          </Box>
          <Box sx={{display: {xs:'flex', sm:'none'} }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/image1.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={ ()=> handleProfile(setting)}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>


      {/* Profile Drawer */}
      <Drawer anchor="right" open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Box sx={{ width: 350, p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Profile Settings</Typography>
          <ProfileAvatar>
            <Person sx={{ fontSize: 32 }} />
          </ProfileAvatar>
          <TextField 
            fullWidth 
            label="Name" 
            margin="normal" 
            variant="outlined" 
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth 
            label="Email" 
            margin="normal" 
            variant="outlined" 
            sx={{ mb: 3 }}
          />
          <Button 
            variant="contained" 
            
            fullWidth
            sx={{ textTransform: 'none', py: 1.5, backgroundColor:"#033043"}}
          >
            Save Changes
          </Button>
        </Box>
      </Drawer>

    </>
  );
}


export default DrawerAppBar;
