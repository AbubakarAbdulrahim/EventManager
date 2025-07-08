import React, { useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Badge,
  Grid,
  Box,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Support as SupportIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext'

// Sample system alerts data
const systemAlerts = [
  {
    id: 'vendor-apps',
    type: 'error',
    priority: 'high',
    category: 'Applications',
    title: '5 vendor applications require review',
    message: 'New vendor applications are waiting for admin approval',
    subtitle: 'Last application received 2 hours ago',
    count: 5,
    icon: <AssignmentIcon />,
    action: 'Review',
    actionType: 'contained',
    badgeColor: 'error'
  },
  {
    id: 'support-tickets',
    type: 'warning',
    priority: 'medium',
    category: 'Support',
    title: '3 customer support tickets awaiting response',
    message: 'Customer support tickets need immediate attention',
    subtitle: 'Oldest ticket was created 5 hours ago',
    count: 3,
    icon: <SupportIcon />,
    action: 'View',
    actionType: 'contained',
    badgeColor: 'warning'
  },
  {
    id: 'maintenance',
    type: 'info',
    priority: 'low',
    category: 'System',
    title: 'System maintenance scheduled',
    message: 'Scheduled maintenance will affect system availability',
    subtitle: 'Scheduled for April 25, 2025 at 02:00 AM',
    count: null,
    icon: <BuildIcon />,
    action: 'Details',
    actionType: 'outlined',
    badgeColor: 'info'
  }
];

const SystemAlertsPanel = () => {
  const { addNotification } = useNotifications();

  // Add these alerts to the notification system when component mounts
  useEffect(() => {
    systemAlerts.forEach(alert => {
      addNotification({
        type: alert.type,
        priority: alert.priority,
        category: alert.category,
        title: alert.title,
        message: alert.message,
        showToast: false, // Don't show as toast, only in bell
        autoHide: false
      });
    });
  }, []);

  const handleAlertAction = (alert) => {
    // Add a new notification when action is clicked
    addNotification({
      type: 'success',
      title: `${alert.action} Action Triggered`,
      message: `You clicked ${alert.action} for: ${alert.title}`,
      priority: 'medium',
      category: 'Action',
      showToast: true,
      duration: 3000
    });
  };

  const getAlertIcon = (alert) => {
    switch (alert.type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return alert.icon;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            System Alerts & Notifications
          </Typography>
          <Chip 
            label={`${systemAlerts.filter(a => a.count).reduce((sum, a) => sum + a.count, 0)} Active`}
            color="primary"
            size="small"
          />
        </Box>
        
        <List sx={{ p: 0 }}>
          {systemAlerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              <ListItem
                sx={{
                  px: 0,
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Badge 
                    color={alert.badgeColor} 
                    variant={alert.count ? "standard" : "dot"}
                    badgeContent={alert.count}
                  >
                    {getAlertIcon(alert)}
                  </Badge>
                </ListItemIcon>
                
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {alert.title}
                      </Typography>
                      {alert.priority === 'high' && (
                        <Chip 
                          label="Urgent" 
                          color="error" 
                          size="small" 
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {alert.subtitle}
                      </Typography>
                      <Chip 
                        label={alert.category}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                />
                
                <Button 
                  size="small" 
                  variant={alert.actionType}
                  color={alert.type === 'error' ? 'error' : 'primary'}
                  onClick={() => handleAlertAction(alert)}
                  sx={{ ml: 2 }}
                >
                  {alert.action}
                </Button>
              </ListItem>
              
              {index < systemAlerts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {/* Summary Footer */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            Total: {systemAlerts.length} system alerts
          </Typography>
          <Button 
            size="small" 
            variant="text"
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'View All Notifications',
                message: 'Opening comprehensive notification center...',
                priority: 'low',
                category: 'Navigation',
                showToast: true,
                duration: 2000
              });
            }}
          >
            View All
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

// Demo wrapper to show how it integrates with your notification system
export default function SystemAlert() {
    const {NotificationBell, NotificationToasts} = useNotifications()
  return (
    // <NotificationProvider>
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Notification Bell (would be in your header/nav) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <NotificationBell userRole="admin" />
        </Box>

        {/* System Alerts Panel */}
        <Grid container spacing={3}>
          <SystemAlertsPanel />
          
          {/* Demo buttons to test the system */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Demo Actions</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <DemoButton 
                  label="New Vendor Application"
                  type="error"
                  title="New Vendor Application Received"
                  message="VendorCorp has submitted a new application for review"
                />
                <DemoButton 
                  label="Support Ticket"
                  type="warning"
                  title="New Support Ticket"
                  message="Customer reported login issues - Ticket #ST-2024-001"
                />
                <DemoButton 
                  label="System Update"
                  type="info"
                  title="System Update Available"
                  message="Version 2.1.4 is ready for installation"
                />
                <DemoButton 
                  label="Success Message"
                  type="success"
                  title="Operation Completed"
                  message="Backup process completed successfully"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Toast notifications container */}
        <NotificationToasts />
      </Box>
    // </NotificationProvider>
  );
}

// Helper component for demo buttons
const DemoButton = ({ label, type, title, message }) => {
  const { addNotification } = useNotifications();
  
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={() => {
        addNotification({
          type,
          title,
          message,
          priority: type === 'error' ? 'high' : 'medium',
          category: 'Demo',
          showToast: true,
          duration: 4000
        });
      }}
    >
      {label}
    </Button>
  );
};