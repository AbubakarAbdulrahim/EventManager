import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Book, Home, Receipt } from '@mui/icons-material';
import { Dashboard } from '@mui/icons-material';

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ width: '100%', backgroundColor:'#033043', position:'fixed', bottom:0, display: {xs:'flex', md:'none'} }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Home"
        value="home"
        href='/'
        icon={<Home sx={{color:'#fff'}}/>}
        sx={{'&.Mui-selected': {color:'#fff'}}}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        href='/favorites'
        icon={<FavoriteIcon sx={{color:'#fff'}} />}
        sx={{'&.Mui-selected': {color:'#fff'}}}
      />
      <BottomNavigationAction
        label="Bookings"
        value="bookings"
        href='/bookings'
        icon={<Book sx={{color:'#fff'}} />}
        sx={{'&.Mui-selected': {color:'#fff'}}}
      />
      <BottomNavigationAction 
      label="Transactions"
      value="transactions"
      href='/transactions'
      icon={<Receipt   sx={{color:'#fff'}} />} 
      sx={{'&.Mui-selected': {color:'#fff'}}}
      />
    </BottomNavigation>
  );
}