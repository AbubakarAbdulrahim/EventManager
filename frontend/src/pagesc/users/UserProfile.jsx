import React, { use, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  Badge,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  VolumeUp as VolumeUpIcon,
  Shield as ShieldIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import DrawerAppBar from '../../components/DrawerAppBar';
import { useNotifications } from '../../context/NotificationContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserProfileComponent() {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const {user, authAxios} = useAuth()
  const {addNotification, NotificationToasts} = useNotifications()
  
  // User Profile State
  const [profile, setProfile] = useState({
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    avatar: 'https://via.placeholder.com/150/2196F3/FFFFFF?text=JD',
    dateJoined: (user.date_joined).split('T',1),
    lastActive: '2024-12-20'
  });

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketingEmails: false,
    profileVisibility: 'public',
    twoFactorAuth: false,
    language: 'en',
    theme: 'light',
    soundEnabled: true,
    autoSave: true,
    dataSharing: false,
    activityTracking: true
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    sessions: [
      { id: 1, device: 'Chrome on Windows', location: 'San Francisco, CA', lastActive: '2 hours ago', current: true },
      { id: 2, device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: '1 day ago', current: false },
      { id: 3, device: 'Firefox on Mac', location: 'Oakland, CA', lastActive: '3 days ago', current: false }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveProfile = () => {
    updateProfile()
    addNotification({ 
      title: "Profile Update",
      type: "success", 
      message: 'Profile updated successfully!',
    });
    setEditMode(false);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
        setSnackbar({ open: true, message: 'Avatar updated successfully!', severity: 'success' });
      };
      reader.readAsDataURL(file);
    }
  };


  const updateProfile = async()=>{
    try{
        console.log(profile);
        
        const res = await authAxios.put(`/user/${user.id}/update/`, profile)
        console.log(res);        
    } catch(error){
        console.error(error);
    }
  }


  return (
    <>
    <DrawerAppBar/>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ p: 3, background: 'linear-gradient(135deg, #0a7273 0%, #033043 100%)', color: 'white', borderRadius: '8px 8px 0 0' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    component="label"
                    sx={{ bgcolor: 'white', width: 32, height: 32, '&:hover': { bgcolor: 'grey.100' } }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                  </IconButton>
                }
              >
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 120, height: 120, border: 4, borderColor: 'white' }}
                />
              </Badge>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold">
                {profile.full_name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                {profile.role} account
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`Joined ${profile.dateJoined}`} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
                <Chip label={`Last active ${profile.lastActive}`} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={editMode ? <CheckIcon /> : <EditIcon />}
                onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                {editMode ? 'Save Profile' : 'Edit Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<PersonIcon />} label="Profile" />   
            <Tab icon={<SettingsIcon />} label="Settings" />
            <Tab icon={<SecurityIcon />} label="Security" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Personal Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Fullname"
                        value={profile.full_name}
                        onChange={(e) => handleProfileUpdate('full_name', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={profile.username}
                        onChange={(e) => handleProfileUpdate('username', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                      />
                    </Grid>
                      <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profile.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profile.phone_number}
                        onChange={(e) => handleProfileUpdate('phone_number', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Notification Preferences
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.smsNotifications}
                          onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                        />
                      }
                      label="SMS Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.marketingEmails}
                          onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                        />
                      }
                      label="Marketing Emails"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Privacy & Preferences
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Profile Visibility</InputLabel>
                      <Select
                        value={settings.profileVisibility}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                        label="Profile Visibility"
                      >
                        <MenuItem value="public">Public</MenuItem>
                        <MenuItem value="friends">Friends Only</MenuItem>
                        <MenuItem value="private">Private</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        label="Language"
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        label="Theme"
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="auto">Auto</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Advanced Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.autoSave}
                            onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                          />
                        }
                        label="Auto-save changes"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.soundEnabled}
                            onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                          />
                        }
                        label="Sound effects"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.dataSharing}
                            onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                          />
                        }
                        label="Data sharing"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ShieldIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Change Password
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        )
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <Button variant="contained" color="primary">
                      Update Password
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        />
                      }
                      label="Enable Two-Factor Authentication"
                    />
                  </Box>
                  {settings.twoFactorAuth && (
                    <Alert severity="success">
                      Two-factor authentication is enabled and protecting your account.
                    </Alert>
                  )}
                  {!settings.twoFactorAuth && (
                    <Alert severity="warning">
                      Enable two-factor authentication to add an extra layer of security to your account.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Active Sessions
                  </Typography>
                  <List>
                    {security.sessions.map((session) => (
                      <ListItem key={session.id} divider>
                        <ListItemIcon>
                          <AccountCircleIcon color={session.current ? 'primary' : 'action'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {session.device}
                              {session.current && <Chip label="Current" size="small" color="primary" />}
                            </Box>
                          }
                          secondary={`${session.location} • ${session.lastActive}`}
                        />
                        {!session.current && (
                          <ListItemSecondaryAction>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => {
                                setSecurity(prev => ({
                                  ...prev,
                                  sessions: prev.sessions.filter(s => s.id !== session.id)
                                }));
                                setSnackbar({ open: true, message: 'Session terminated', severity: 'success' });
                              }}
                            >
                              Terminate
                            </Button>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    <NotificationToasts/>
    </>
  );
}