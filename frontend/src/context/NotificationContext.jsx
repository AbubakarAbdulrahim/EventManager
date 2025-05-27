import React, { useState, useEffect, createContext, useContext } from 'react';
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
import {
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export default function NotificationProvider ({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toastNotifications, setToastNotifications] = useState([]);

  useEffect(() => {
        const storedNotifications = localStorage.getItem("notifications")
        if(storedNotifications) {
            setNotifications(JSON.parse(storedNotifications))
        }
    
    },[]);

    useEffect(()=>{
        localStorage.setItem('notifications', JSON.stringify(notifications))
    },[notifications]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.showToast !== false) {
      setToastNotifications(prev => [...prev, newNotification]);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeToast = (id) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      NotificationBell,
      NotificationToasts,
      toastNotifications,
      addNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      removeToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Toast Notification Component
const ToastNotification = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const getSeverity = () => {
    switch (notification.type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ minWidth: 300, maxWidth: 500 }}
      >
        <AlertTitle>{notification.title}</AlertTitle>
        {notification.message}
      </Alert>
    </motion.div>
  );
};

// Toast Container
export const NotificationToasts = () => {
  const { toastNotifications, removeToast } = useNotifications();

  useEffect(() => {
    toastNotifications.forEach(notification => {
      if (notification.autoHide !== false) {
        const timer = setTimeout(() => {
          removeToast(notification.id);
        }, notification.duration || 4000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [toastNotifications, removeToast]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >
      <AnimatePresence>
        {toastNotifications.map(notification => (
          <motion.div key={notification.id} layout>
            <ToastNotification
              notification={notification}
              onClose={() => removeToast(notification.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

// Individual Notification Item
const NotificationItem = ({ notification, onClick, onMarkRead, onDelete }) => {
  const getIcon = () => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'default';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        elevation={notification.read ? 0 : 1}
        sx={{
          p: 2,
          mb: 1,
          cursor: 'pointer',
          border: notification.read ? '1px solid #e0e0e0' : '2px solid #033043',
          backgroundColor: notification.read ? 'inherit' : 'rgba(3,48,67,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => onClick?.(notification)}
      >
        {!notification.read && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: 'primary.main'
            }}
          />
        )}
        
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {notification.avatar ? (
            <Avatar src={notification.avatar} sx={{ width: 32, height: 32 }} />
          ) : (
            getIcon()
          )}
          
          <Box flex={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  fontWeight={notification.read ? 'normal' : 'bold'}
                  color={notification.read ? 'text.secondary' : 'text.primary'}
                >
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {notification.message}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(notification.timestamp)}
                  </Typography>
                  {notification.category && (
                    <Chip
                      label={notification.category}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                  )}
                  {notification.priority && notification.priority !== 'low' && (
                    <Chip
                      label={notification.priority}
                      size="small"
                      color={getPriorityColor()}
                      sx={{ height: 20 }}
                    />
                  )}
                </Stack>
              </Box>
              
              <Stack direction="row" spacing={0.5}>
                {!notification.read && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead?.(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <MarkReadIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(notification.id);
                  }}
                  title="Delete"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};

// Main Notification Bell Component
export const NotificationBell = ({ userRole = 'customer' }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotifications();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 10);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action) {
      notification.action();
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          position: 'relative',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)'
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            width: 400,
            maxHeight: 600,
            mt: 1.5,
            '& .MuiMenuItem-root': {
              padding: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </Typography>
            <IconButton size="small" onClick={handleMenuClick}>
              <SettingsIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflow: 'auto', p: 1 }}>
          <AnimatePresence>
            {recentNotifications.length > 0 ? (
              recentNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onMarkRead={markAsRead}
                  onDelete={removeNotification}
                />
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Box>

        {/* Footer Actions */}
        {notifications.length > 0 && [
          <Divider key="divider" />,
          <Box key="actions" sx={{ p: 1 }}>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={() => {
                  markAllAsRead();
                  handleClose();
                }}
                disabled={unreadCount === 0}
              >
                Mark All Read
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => {
                  clearAll();
                  handleClose();
                }}
              >
                Clear All
              </Button>
            </Stack>
          </Box>
        ]}

      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Notification Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <MarkReadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark All as Read</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear All</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};