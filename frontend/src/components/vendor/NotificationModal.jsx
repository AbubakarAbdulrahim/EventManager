
import { Typography,Menu, 
    MenuItem, Divider,  } from "@mui/material"

export default function NotificationModal({notificationsAnchorEl, handleNotificationsClose}) {
    return (
        <Menu
    anchorEl={notificationsAnchorEl}
    open={Boolean(notificationsAnchorEl)}
    onClose={handleNotificationsClose}
    PaperProps={{
    elevation: 0,
    sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
        },
        '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
        },
    },
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
    <MenuItem onClick={handleNotificationsClose}>
    <Typography variant="body2">New booking request from Jane Smith</Typography>
    </MenuItem>
    <MenuItem onClick={handleNotificationsClose}>
    <Typography variant="body2">Vendor approval pending for Elegant Designs</Typography>
    </MenuItem>
    <MenuItem onClick={handleNotificationsClose}>
    <Typography variant="body2">Customer support ticket #1234 requires attention</Typography>
    </MenuItem>
    <MenuItem onClick={handleNotificationsClose}>
    <Typography variant="body2">System update scheduled for tomorrow</Typography>
    </MenuItem>
    <Divider />
    <MenuItem onClick={handleNotificationsClose}>
    <Typography variant="body2" color="primary">View all notifications</Typography>
    </MenuItem>
</Menu>
    )
};
