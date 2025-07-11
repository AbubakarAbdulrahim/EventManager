import { useState } from "react";
import { useServiceContext } from "../context/ServiceContext";
import DrawerAppBar from "../components/DrawerAppBar";
// import { Typography } from "@mui/material/Typography";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Slider,
  Select,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Badge,
  Box,
  styled
} from '@mui/material';
import ServicesCard from "../components/ServicesCard";

export default function Favorites() {
    const {favorites} = useServiceContext();

    if(favorites){
        console.log(favorites)
        return (
            <>
            {favorites.length !==0 ? 
                <>
            <DrawerAppBar/>
            <Typography variant="h4" sx={{ m:5, color:'#033043', textAlign:'center'}}><strong>Favorites</strong></Typography>
            <div style={{display: 'flex', flexWrap:'wrap', gap: 10, justifyContent:"center", margin: 10, width: '100%'}}>
                {favorites.map(service => <ServicesCard key={service.id} service={service}/>)}
            </div>
            {/* <Typography variant="body2" sx={{textAlign:'center', m:5}}>
                <Button size="small" variant="contained" sx={{backgroundColor:'#674101'}} href="/">Go to Home</Button>
            </Typography>  */}
                </>
            :
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
    
            <Card sx={{ minWidth: 400, textAlign:'center' }}>
                  <CardContent>
                    <Typography variant="h5" component="div" color="text.primary">
                      <strong>No Favorite Venues yet</strong>
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Add some venues to your favorites list.
                    </Typography>
                    <Typography variant="body2">
                      <Button size="small" variant="contained" sx={{backgroundColor:'#033043'}} href="/dashboard">Go to Home</Button>
                    </Typography>
                  </CardContent>
                </Card>
            </Box>
            }
            </>
        )
    }
};
