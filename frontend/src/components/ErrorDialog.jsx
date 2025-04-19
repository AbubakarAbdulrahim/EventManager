import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Avatar} from '@mui/material';
import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';

export default function ErrorDialog({open, handleClose, url, title, body, action}) {
    const navigate = useNavigate();
    
    return (

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ color: '#033043', fontWeight: 600 }}>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar sx={{ bgcolor: '#e53935', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 56, height: 56 }}>
                    <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 1 }}
                    >
                        <ClearIcon sx={{color:"#fff", fontSize:"2em"}}/>
                    </motion.div>
                    </Avatar>
                    <Typography sx={{ mt: 2, mb: 1, fontSize:'1.2em' }} textAlign={'center'} color="text.primary">
                        {title}
                    </Typography>
                    {body && <Typography variant="body2" textAlign={'center'} color="text.secondary">
                        {/* Your booking has been successfully completed. Thank you for choosing us! */}
                        {body}
                    </Typography>}
                </Box>
                
            </DialogContent>
            {action &&
            <DialogActions sx={{ pb: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button variant="contained" color="primary" onClick={() => {navigate(url);}} sx={{ width: '80%', borderRadius: 20, fontWeight: 600 }}>
                    {action}
                </Button>
            </DialogActions>
            }
        </Dialog>
    )
};
