import { useNotifications } from "../context/NotificationContext";
import {
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
  Box,
  Typography,
  Chip,
  Avatar,
  Stack,
  Button,
  Paper,
  Divider,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';


// Demo Component showing usage examples
export default function Notification() {
  const { addNotification,NotificationBell, NotificationToasts } = useNotifications();

  const adminNotifications = [
    {
      title: "New Vendor Registration",
      message: "TechStore Inc. has applied for vendor registration",
      type: "info",
      category: "Admin",
      priority: "high",
      action: () => console.log("Navigate to vendor approvals")
    },
    {
      title: "System Alert",
      message: "Server CPU usage is above 80%",
      type: "warning",
      category: "System",
      priority: "high"
    },
    {
      title: "Monthly Report Ready",
      message: "Your monthly analytics report is now available",
      type: "success",
      category: "Reports",
      priority: "medium"
    }
  ];

  const vendorNotifications = [
    {
      title: "New Order Received",
      message: "Order #12345 for $299.99 has been placed",
      type: "success",
      category: "Orders",
      priority: "high",
      avatar: "/api/placeholder/32/32"
    },
    {
      title: "Low Stock Alert",
      message: "iPhone 15 Pro Max has only 5 units left",
      type: "warning",
      category: "Inventory",
      priority: "medium"
    },
    {
      title: "Payment Processed",
      message: "Weekly payout of $2,450.00 has been processed",
      type: "success",
      category: "Finance",
      priority: "low"
    }
  ];

  const customerNotifications = [
    {
      title: "Order Shipped",
      message: "Your order #98765 has been shipped and is on the way",
      type: "success",
      category: "Orders",
      priority: "medium"
    },
    {
      title: "Special Offer",
      message: "20% off on electronics - Limited time offer!",
      type: "info",
      category: "Promotions",
      priority: "low"
    },
    {
      title: "Payment Failed",
      message: "Your subscription payment could not be processed",
      type: "error",
      category: "Billing",
      priority: "high"
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Notification System Demo
      </Typography>
      
      <Stack spacing={3}>
        {/* Demo Controls */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Notifications
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addNotification(adminNotifications[0])}
            >
              Add Admin Notification
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={() => addNotification(vendorNotifications[0])}
            >
              Add Vendor Notification
            </Button>
            
            <Button
              variant="contained"
              color="success"
              onClick={() => addNotification(customerNotifications[0])}
            >
              Add Customer Notification
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                adminNotifications.forEach((notif, index) => {
                  setTimeout(() => addNotification(notif), index * 500);
                });
              }}
            >
              Load Admin Demo Data
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                vendorNotifications.forEach((notif, index) => {
                  setTimeout(() => addNotification(notif), index * 500);
                });
              }}
            >
              Load Vendor Demo Data
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                customerNotifications.forEach((notif, index) => {
                  setTimeout(() => addNotification(notif), index * 500);
                });
              }}
            >
              Load Customer Demo Data
            </Button>
          </Stack>
        </Paper>

        {/* Notification Bell Demo */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Bell Component
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Click the bell icon to view notifications. The badge shows unread count.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 100,
            backgroundColor: '#1976d2',
            borderRadius: 1,
            position: 'relative'
          }}>
            <NotificationBell />
          </Box>
        </Paper>

        {/* Usage Instructions */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Usage Instructions
          </Typography>
          
          <Typography variant="body2" paragraph>
            1. Wrap your app with <code>NotificationProvider</code>
          </Typography>
          <Typography variant="body2" paragraph>
            2. Add <code>NotificationToasts</code> component to show toast notifications
          </Typography>
          <Typography variant="body2" paragraph>
            3. Use <code>NotificationBell</code> in your navigation bar
          </Typography>
          <Typography variant="body2" paragraph>
            4. Use <code>useNotifications()</code> hook to add notifications programmatically
          </Typography>
        </Paper>
      </Stack>

      <NotificationToasts />
    </Box>
  );
}