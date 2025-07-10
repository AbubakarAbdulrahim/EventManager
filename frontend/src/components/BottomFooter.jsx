
import React from 'react';
import { Box, Container, Grid, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const primaryColor = '#033043';


export default function BottomFooter() {
    return(
        <>
            {/* Footer */}
      <Box sx={{ py: 6, bgcolor: '#033043' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                  EventMaster
                </Typography>
              </Box>
              <Typography variant="body2" color={'#fff'} paragraph>
                The all-in-one platform for planning and booking extraordinary events.
              </Typography>
              <Box sx={{ mt: 2, mb: 4 }}>
                {/* Social icons would go here */}
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={'#fff'}>
                Services
              </Typography>
              <List dense disablePadding>
                {['Venues', 'Catering', 'Musicians', 'Photography', 'Decoration'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: '#fff'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={'#fff'}>
                Company
              </Typography>
              <List dense disablePadding>
                {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: '#fff'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={'#fff'}>
                Resources
              </Typography>
              <List dense disablePadding>
                {['FAQ', 'Support', 'Event Guides', 'Partnerships', 'Vendors'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: '#fff'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={'#fff'}>
                Legal
              </Typography>
              <List dense disablePadding>
                {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: '#fff'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="body2" color={'#fff'} align="center">
            © {new Date().getFullYear()} EventMaster. All rights reserved.
          </Typography>
        </Container>
      </Box>
        </>
    )
}