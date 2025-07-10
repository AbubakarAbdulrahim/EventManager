import { Snackbar, Alert } from "@mui/material";

export default function SnackBarNotification({snackbarOpen, handleCloseSnackbar, snackbarSeverity, snackbarMessage}) {
    return (
        <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={3000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal:'center' }}
        >
            <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ width: '100%' }}
            >
            {snackbarMessage}
            </Alert>
        </Snackbar>
    )
};
