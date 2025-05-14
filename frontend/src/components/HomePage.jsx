import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent,
  TextField, MenuItem, Box, IconButton, Drawer, List, ListItem, ListItemText,
  Avatar, Divider, Paper, useMediaQuery, FormControl, InputLabel, Select,
  Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CameraAlt, MusicNote, Restaurant, Room, Brush, 
  CalendarToday, Search, People, ArrowForward, Menu, Close 
} from '@mui/icons-material';

// Main colors: primary #033043, secondary #0a7273
const primaryColor = '#033043';
const secondaryColor = '#0a7273';

// Custom styled components
const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[2],
}));

const ServiceCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  height: '100%',
  transition: 'all 0.3s ease',
  border: selected ? `2px solid ${secondaryColor}` : 'none',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  backgroundColor: `${secondaryColor}20`,
  color: secondaryColor,
  width: 56,
  height: 56,
  marginBottom: theme.spacing(2),
}));

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const services = [
    { id: 'venue', name: 'Venues', icon: <Room fontSize="large" /> },
    { id: 'catering', name: 'Catering', icon: <Restaurant fontSize="large" /> },
    { id: 'music', name: 'Musicians', icon: <MusicNote fontSize="large" /> },
    { id: 'photography', name: 'Photography', icon: <CameraAlt fontSize="large" /> },
    { id: 'decoration', name: 'Decoration', icon: <Brush fontSize="large" /> },
  ];

  const features = [
    {
      icon: <CalendarToday fontSize="large" />,
      title: "Easy Scheduling",
      description: "Book your perfect date with our intuitive calendar system"
    },
    {
      icon: <Search fontSize="large" />,
      title: "Find The Best Services",
      description: "Compare top-rated vendors in your area with verified reviews"
    },
    {
      icon: <People fontSize="large" />,
      title: "All-in-One Platform",
      description: "Manage every aspect of your event from a single dashboard"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Wedding Planner",
      text: "This platform revolutionized how I manage events. Everything I need is in one place!"
    },
    {
      name: "Michael Chen",
      role: "Corporate Event Manager",
      text: "The seamless integration between vendors saved us countless hours of coordination."
    },
    {
      name: "Amanda Rodriguez",
      role: "Birthday Party Host",
      text: "I found amazing vendors within my budget in minutes. Highly recommend!"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Navigation */}
      <AppBar position="sticky" sx={{ bgcolor: '#033043', boxShadow: 2 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
            >
              <img src="./EventMaster.png" height={'36'} alt="" />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                EventMaster
              </Typography>
            </motion.div>
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Button color="inherit" sx={{ color: 'text.light' }}>Home</Button>
              <Button color="inherit" href="#services" sx={{ color: 'text.light' }}>Services</Button>
              <Button color="inherit" href="#how-it-works" sx={{ color: 'text.light' }}>How It Works</Button>
              <Button color="inherit" href="#testimonials" sx={{ color: 'text.light' }}>Testimonials</Button>
              
              <Button 
                variant="contained" 
                disableElevation
                sx={{ 
                  ml: 2, 
                  bgcolor: secondaryColor,
                  '&:hover': {
                    bgcolor: '#086263'
                  }
                }}
              >
                Sign Up
              </Button>
              <Button 
                variant="outlined"
                sx={{ 
                  ml: 2,
                  borderColor: 'grey.300',
                  color: '#fff'
                }}
              >
                Log In
              </Button>
            </Box>
            
            {/* Mobile menu button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleMenu}
                color="inherit"
                sx={{ color: 'text.secondary' }}
              >
                {isMenuOpen ? <Close /> : <Menu />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
        
        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="top"
          open={isMenuOpen && isMobile}
          onClose={toggleMenu}
          sx={{
            '& .MuiDrawer-paper': {
              boxShadow: 3,
            },
          }}
        >
          <Box sx={{ width: 'auto', p: 2 }} role="presentation" onClick={toggleMenu}>
            <List>
              <ListItem button component="a" href="#">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component="a" href="#services">
                <ListItemText primary="Services" />
              </ListItem>
              <ListItem button component="a" href="#how-it-works">
                <ListItemText primary="How It Works" />
              </ListItem>
              <ListItem button component="a" href="#testimonials">
                <ListItemText primary="Testimonials" />
              </ListItem>
            </List>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="contained" 
                fullWidth 
                disableElevation
                sx={{ 
                  bgcolor: secondaryColor,
                  '&:hover': {
                    bgcolor: '#086263'
                  }
                }}
              >
                Sign Up
              </Button>
              <Button 
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: 'grey.300',
                  color: 'text.primary'
                }}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Drawer>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    color: primaryColor,
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  Plan Your Perfect Event in One Place
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Typography variant="h6" paragraph sx={{ color: 'text.secondary', mb: 4 }}>
                  Book venues, caterers, photographers and more - all on one seamless platform.
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
              >
                <HeroButton 
                  variant="contained" 
                  disableElevation
                  endIcon={<ArrowForward />}
                  sx={{ 
                    bgcolor: secondaryColor,
                    '&:hover': {
                      bgcolor: '#086263'
                    }
                  }}
                >
                  Get Started
                </HeroButton>
                <HeroButton 
                  variant="outlined"
                  sx={{ 
                    borderColor: 'grey.300',
                    color: 'text.primary'
                  }}
                >
                  Watch Demo
                </HeroButton>
              </motion.div>
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 3, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color={secondaryColor}>350+</Typography>
                      <Typography variant="body2" color="text.secondary">Vendors</Typography>
                    </Box>
                    <Box sx={{ mr: 3, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color={secondaryColor}>50k+</Typography>
                      <Typography variant="body2" color="text.secondary">Events</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color={secondaryColor}>25k+  </Typography>
                      <Typography variant="body2" color="text.secondary">Happy Clients</Typography>
                    </Box>
                  </Box>
                </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{ position: 'relative' }}
              >
                <Paper 
                  elevation={6}
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    width: '100%'
                  }}
                >
                  <img 
                    src="./image1.jpg" 
                    alt="Event planning dashboard" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Paper>
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'absolute',
                      bottom: '-24px',
                      right: '-24px',
                      p: 2,
                      borderTop: `4px solid ${secondaryColor}`,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">200+</Typography>
                    <Typography variant="body2" color="text.secondary">Trusted Vendors</Typography>
                  </Paper>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', color: primaryColor }}
            >
              All You Need For Your Event
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Browse and book the best services in your area
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={6} sm={4} md={2.4} key={service.id}>
                  <motion.div variants={itemVariants}>
                    <ServiceCard 
                      elevation={2}
                      selected={selectedService === service.id}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${primaryColor}15`,
                            color: primaryColor,
                            width: 56,
                            height: 56,
                            margin: '0 auto 16px'
                          }}
                        >
                          {service.icon}
                        </Avatar>
                        <Typography variant="h6" gutterBottom>
                          {service.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: secondaryColor,
                            fontWeight: 500
                          }}
                        >
                          Explore
                        </Typography>
                      </CardContent>
                    </ServiceCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Feature Highlight Section */}
      <Box id="how-it-works" sx={{ py: 8, bgcolor: `${primaryColor}05` }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', color: primaryColor }}
            >
              How It Works
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Plan your event in just a few simple steps
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div variants={itemVariants}>
                    <Paper 
                      elevation={2}
                      sx={{ 
                        p: 4, 
                        height: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)'
                        }
                      }}
                    >
                      <FeatureIcon>{feature.icon}</FeatureIcon>
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button 
                variant="contained" 
                endIcon={<ArrowForward />}
                disableElevation
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  bgcolor: secondaryColor,
                  '&:hover': {
                    bgcolor: '#086263'
                  }
                }}
              >
                See How It Works
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Search and Booking Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h3" 
                  component="h2" 
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: primaryColor }}
                >
                  Find The Perfect Fit For Your Event
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Our smart matching algorithm helps you discover the perfect vendors based on your specific event needs and budget.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  {[
                    "Filter by location, price, availability, and style",
                    "Read verified reviews from real customers",
                    "Instantly check availability and book online"
                  ].map((text, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box 
                        sx={{ 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          bgcolor: secondaryColor,
                          mt: 1,
                          flexShrink: 0
                        }} 
                      />
                      <Typography sx={{ ml: 2 }}>{text}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: 60, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Paper elevation={3} sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ fontWeight: 'bold', color: primaryColor, mb: 3 }}
                  >
                    Find Event Services
                  </Typography>
                  
                  <Box component="form" sx={{ '& > :not(style)': { mb: 3 } }}>
                    <FormControl fullWidth>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        label="Event Type"
                        defaultValue=""
                      >
                        <MenuItem value="wedding">Wedding</MenuItem>
                        <MenuItem value="corporate">Corporate Event</MenuItem>
                        <MenuItem value="birthday">Birthday Party</MenuItem>
                        <MenuItem value="conference">Conference</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField 
                      fullWidth 
                      label="Location" 
                      placeholder="City or ZIP code" 
                      variant="outlined" 
                    />
                    
                    <TextField 
                      fullWidth 
                      label="Event Date" 
                      type="date" 
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                    
                    <FormControl fullWidth>
                      <InputLabel>Service Type</InputLabel>
                      <Select
                        label="Service Type"
                        defaultValue=""
                      >
                        <MenuItem value="all">All Services</MenuItem>
                        <MenuItem value="venue">Venues</MenuItem>
                        <MenuItem value="catering">Catering</MenuItem>
                        <MenuItem value="photography">Photography</MenuItem>
                        <MenuItem value="music">Music</MenuItem>
                        <MenuItem value="decoration">Decoration</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Button 
                      fullWidth 
                      variant="contained"
                      disableElevation
                      size="large"
                      sx={{ 
                        mt: 2,
                        py: 1.5,
                        bgcolor: secondaryColor,
                        '&:hover': {
                          bgcolor: '#086263'
                        }
                      }}
                    >
                      Search Services
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box id="testimonials" sx={{ py: 8, bgcolor: primaryColor, color: 'white' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              What Our Users Say
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Don't just take our word for it
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index} sx={{ display: 'flex', flexGrow: 1, }}>
                  <motion.div variants={itemVariants}>
                    <Paper 
                      elevation={3}
                      sx={{ 
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                      }}
                    >
                      <Rating
                        name="read-only"
                        value={3.5}
                        readOnly
                        precision={0.5}
                        sx={{ mb: 2, color: secondaryColor }}
                      />
                      <Typography 
                        variant="body1" 
                        paragraph
                        sx={{ 
                          fontStyle: 'italic',
                          mb: 3,
                          flexGrow: 1
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: secondaryColor,
                            width: 48,
                            height: 48
                          }}
                        >
                          {testimonial.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', color: primaryColor }}
            >
              Ready to Plan Your Perfect Event?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Join thousands of event planners who have simplified their event planning process
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              disableElevation
              endIcon={<ArrowForward />}
              sx={{ 
                px: 4, 
                py: 1.5, 
                bgcolor: secondaryColor,
                '&:hover': {
                  bgcolor: '#086263'
                }
              }}
            >
              Get Started Now
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: primaryColor }}>
                  EventMaster
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                The all-in-one platform for planning and booking extraordinary events.
              </Typography>
              <Box sx={{ mt: 2, mb: 4 }}>
                {/* Social icons would go here */}
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Services
              </Typography>
              <List dense disablePadding>
                {['Venues', 'Catering', 'Musicians', 'Photography', 'Decoration'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.secondary'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Company
              </Typography>
              <List dense disablePadding>
                {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.secondary'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Resources
              </Typography>
              <List dense disablePadding>
                {['FAQ', 'Support', 'Event Guides', 'Partnerships', 'Vendors'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.secondary'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Legal
              </Typography>
              <List dense disablePadding>
                {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings'].map((item) => (
                  <ListItem key={item} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={item} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: 'text.secondary'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} EventMaster. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}