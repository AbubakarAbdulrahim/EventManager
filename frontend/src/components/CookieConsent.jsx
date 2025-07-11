import React, { useState, useEffect } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    
    if (!consent) {
      setOpen(true);
    } else {
      setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setAccepted(true);
    setOpen(false);
  };

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="info" sx={{ width: '100%' }} action={
        <Button color="inherit" size="small" onClick={handleAccept}>
          Accept
        </Button>
      }>
        We use cookies to enhance your experience. By continuing, you agree to our cookie policy.
      </Alert>
    </Snackbar>
  );
};

export default CookieConsent;
