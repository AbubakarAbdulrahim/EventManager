import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
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
  ListItemText,
  CircularProgress
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
  Circle as CircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authAxios, user } = useAuth();
  
  const isMounted = useRef(true);
  const toastTimers = useRef(new Map());

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Clear all toast timers
      toastTimers.current.forEach(timer => clearTimeout(timer));
      toastTimers.current.clear();
    };
  }, []);

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!authAxios) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await authAxios.get('/user/notification/');
      const data = res.data;
      console.log(data);
      
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid notification data format');
      }

      if (isMounted.current) {
        // Ensure each notification has required fields
        const validatedNotifications = data.map(notification => ({
          id: notification.id || Date.now() + Math.random(),
          title: notification.title || 'Notification',
          message: notification.message || '',
          type: notification.type || 'info',
          priority: notification.priority || 'low',
          read: Boolean(notification.read),
          timestamp: notification.created_at ? new Date(notification.created_at) : new Date(),
          category: notification.category || null,
          avatar: notification.avatar || null,
          icon: notification.icon || null,
          ...notification
        }));

        setNotifications(validatedNotifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      if (isMounted.current) {
        setError('Failed to load notifications');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [authAxios]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Add notification (local and server)
  const addNotification = useCallback(async (notification) => {
    if (!notification || !notification.title) {
      console.error('Invalid notification data');
      return;
    }

    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      type: 'info',
      priority: 'low',
      showToast: true,
      autoHide: true,
      duration: 4000,
      ...notification
    };

    // Add to local state immediately for better UX
    if (isMounted.current) {
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast for high priority notifications or when explicitly requested
      if (newNotification.priority === 'high' || newNotification.showToast !== false) {
        setToastNotifications(prev => [...prev, newNotification]);
        
        // Set auto-hide timer
        if (newNotification.autoHide !== false) {
          const timer = setTimeout(() => {
            removeToast(newNotification.id);
          }, newNotification.duration);
          
          toastTimers.current.set(newNotification.id, timer);
        }
      }
    }

    // Try to save to server (don't fail if server is down)
    if (authAxios) {
      try {
        await authAxios.post('/user/notification/', newNotification);
      } catch (error) {
        console.warn('Failed to save notification to server:', error);
        // Don't remove from local state - it's still valid
      }
    }

    return newNotification;
  }, [authAxios]);

  // Remove notification
  const removeNotification = useCallback(async (id) => {
    if (!id) return;

    // Remove from local state immediately
    if (isMounted.current) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Also remove from toasts if present
      setToastNotifications(prev => prev.filter(n => n.id !== id));
      
      // Clear timer if exists
      const timer = toastTimers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        toastTimers.current.delete(id);
      }
    }

    // Try to delete from server
    if (authAxios) {
      try {
        await authAxios.delete(`/user/notification/${id}/`);
      } catch (error) {
        console.warn('Failed to delete notification from server:', error);
        // Consider re-adding to local state if this is critical
      }
    }
  }, [authAxios, ]);

  // Mark as read
  const markAsRead = useCallback(async (id) => {
    if (!id) return;

    // Update local state immediately
    if (isMounted.current) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }

    // Try to update server
    if (authAxios ) {
      try {
        await authAxios.patch(`/user/notification/${id}/`, { read: true });
      } catch (error) {
        console.warn('Failed to mark notification as read on server:', error);
      }
    }
  }, [authAxios, ]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    // Update local state immediately
    if (isMounted.current) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }

    // Try to update server
    if (authAxios) {
      try {
        await authAxios.patch('/user/notification/mark-all-read/');
      } catch (error) {
        console.warn('Failed to mark all notifications as read on server:', error);
      }
    }
  }, [authAxios]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    // Clear local state immediately
    if (isMounted.current) {
      setNotifications([]);
      setToastNotifications([]);
      
      // Clear all timers
      toastTimers.current.forEach(timer => clearTimeout(timer));
      toastTimers.current.clear();
    }

    // Try to clear server
    if (authAxios) {
      try {
        await authAxios.delete('/user/notification/clear-all/');
      } catch (error) {
        console.warn('Failed to clear notifications on server:', error);
      }
    }
  }, [authAxios]);

  // Remove toast notification
  const removeToast = useCallback((id) => {
    if (!id || !isMounted.current) return;
    
    setToastNotifications(prev => prev.filter(n => n.id !== id));
    
    // Clear timer if exists
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Retry fetch
  const retryFetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const contextValue = React.useMemo(() => ({
    notifications,
    toastNotifications,
    loading,
    error,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeToast,
    clearError,
    retryFetch,
    fetchNotifications
  }), [
    notifications,
    toastNotifications,
    loading,
    error,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeToast,
    clearError,
    retryFetch,
    fetchNotifications
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Toast Notification Component
const ToastNotification = React.memo(({ notification, onClose }) => {
  const getIcon = () => {
    if (notification.icon) return notification.icon;
    
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
            onClick={() => onClose?.(notification.id)}
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
});

ToastNotification.displayName = 'ToastNotification';

// Toast Container
export const NotificationToasts = () => {
  const { toastNotifications, removeToast } = useNotifications();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence mode="popLayout">
        {toastNotifications.map(notification => (
          <motion.div 
            key={notification.id} 
            layout
            style={{ pointerEvents: 'auto' }}
          >
            <ToastNotification
              notification={notification}
              onClose={removeToast}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

// Individual Notification Item
const NotificationItem = React.memo(({ notification, onClick, onMarkRead, onDelete }) => {
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
    if (!timestamp) return 'Unknown';
    
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return 'Just now';
    } catch {
      return 'Unknown';
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    onClick?.(notification);
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMarkRead?.(notification.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(notification.id);
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
        onClick={handleClick}
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
            <Avatar 
              src={notification.avatar} 
              sx={{ width: 32, height: 32 }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
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
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {notification.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
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
                    onClick={handleMarkRead}
                    title="Mark as read"
                  >
                    <MarkReadIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={handleDelete}
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
});

NotificationItem.displayName = 'NotificationItem';

// Main Notification Bell Component
export const NotificationBell = ({ userRole = 'customer' }) => {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    retryFetch,
    clearError
  } = useNotifications();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 10);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (error) clearError();
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
    if (notification.action && typeof notification.action === 'function') {
      try {
        notification.action();
      } catch (err) {
        console.error('Error executing notification action:', err);
      }
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    handleClose();
  };

  const handleClearAll = () => {
    clearAll();
    handleClose();
  };

  const handleRetry = () => {
    retryFetch();
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
        disabled={loading}
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
            <Stack direction="row" spacing={1}>
              {loading && <CircularProgress size={20} />}
              <IconButton size="small" onClick={handleRetry} title="Refresh">
                <RefreshIcon />
              </IconButton>
              <IconButton size="small" onClick={handleMenuClick}>
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* Error State */}
        {error && (
          <Box sx={{ p: 2, backgroundColor: 'error.light', color: 'error.contrastText' }}>
            <Typography variant="body2">{error}</Typography>
            <Button size="small" onClick={handleRetry} sx={{ mt: 1, color: 'inherit' }}>
              Retry
            </Button>
          </Box>
        )}

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflow: 'auto', p: 1 }}>
          <AnimatePresence mode="popLayout">
            {recentNotifications.length > 0 ? (
              recentNotifications.map(notification => (
                <NotificationItem
                  key={`${notification.id}-${notification.timestamp}`}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onMarkRead={markAsRead}
                  onDelete={removeNotification}
                />
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {loading ? 'Loading notifications...' : 'No notifications yet'}
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
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0 || loading}
              >
                Mark All Read
              </Button>
              <Button
                size="small"
                color="error"
                onClick={handleClearAll}
                disabled={loading}
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
        <MenuItem 
          onClick={() => {
            markAllAsRead();
            handleMenuClose();
          }}
          disabled={unreadCount === 0}
        >
          <ListItemIcon>
            <MarkReadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark All as Read</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            clearAll();
            handleMenuClose();
          }}
          disabled={notifications.length === 0}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear All</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};