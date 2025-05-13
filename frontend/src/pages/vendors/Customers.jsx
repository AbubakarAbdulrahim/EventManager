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
  { id: 1, name: 'Photography', description: 'Professional event photography services', price: 1200, isActive: true, customers: 10, income: 12000 },
  { id: 2, name: 'Venue Rental', description: 'Spacious and well-decorated event venues', price: 5000, isActive: true, customers: 4, income: 20000 },
  { id: 3, name: 'Catering Services', description: 'Delicious traditional and continental meals', price: 3000, isActive: false, customers: 6, income: 18000 },
];

const initialCustomers = [
  { id: 1, name: 'Amina Bello', email: 'amina.bello@example.com', company: 'Arewa Events', services: [1, 2], totalSpent: 6200 },
  { id: 2, name: 'Musa Abdullahi', email: 'musa.abdullahi@example.com', company: 'Northern Touch', services: [1], totalSpent: 1200 },
  { id: 3, name: 'Hauwa Yusuf', email: 'hauwa.yusuf@example.com', company: 'Zaria Planners', services: [2, 3], totalSpent: 8000 },
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
