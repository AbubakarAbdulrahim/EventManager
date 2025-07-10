import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const VendorAnalytics = ({ vendorId }) => {
  const [analytics, setAnalytics] = useState({ views: 0, phone_reveals: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch(`/api/vendor-analytics/${vendorId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await res.json();
      setAnalytics(data);
    };
    fetchAnalytics();
  }, [vendorId]);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Vendor Analytics</Typography>
        <Typography>Profile Views: {analytics.views}</Typography>
        <Typography>Phone Reveals: {analytics.phone_reveals}</Typography>
      </CardContent>
    </Card>
  );
};

export default VendorAnalytics;
