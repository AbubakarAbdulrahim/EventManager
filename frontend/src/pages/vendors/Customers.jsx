import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Box, CssBaseline, Divider, Container, Grid, Paper, Card, CardContent, CardActions, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, 
  Avatar, Chip, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, 
  Alert, CircularProgress, Badge, ThemeProvider, createTheme, useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, AddCircle, Delete, Edit, Visibility, 
  VisibilityOff, Person, Business, AttachMoney, Settings as SettingsIcon, 
  Logout, Menu as MenuIcon, Search, CheckCircle, Cancel, Star
} from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const services = [
    { id: 1, name: 'Web Development', description: 'Custom website development services', price: 1500, isActive: true, customers: 12, income: 18000 },
    { id: 2, name: 'Logo Design', description: 'Professional logo design service', price: 350, isActive: true, customers: 25, income: 8750 },
    { id: 3, name: 'SEO Optimization', description: 'Search engine optimization services', price: 750, isActive: false, customers: 8, income: 6000 },
  ];

const initialCustomers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', company: 'ABC Corp', services: [1, 2], totalSpent: 1850 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', company: 'XYZ Inc', services: [1], totalSpent: 1500 },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', company: 'Acme Co', services: [2, 3], totalSpent: 1100 },
  ];

export default function Customers() {
    const [customers, setCustomers] = useState(initialCustomers);

    return (
        <>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Customers
          </Typography>
    
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Total Spent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      {customer.services.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return service ? (
                          <Chip 
                            key={serviceId}
                            label={service.name}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>₦{customer.totalSpent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        </>
      );
        
};
