import { Route, BrowserRouter, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ServiceProvider } from "./context/ServiceContext";
import {BookingsProvider} from "./context/BookingsContext";
import Favorites from "./pages/Favorites";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import AddService from "./pages/AddService";
import VendorApplication from "./pages/VendorApplication";
import VendorApplicationAdminPage from "./pages/VendorApplicationAdminPage";
import ServiceDetail from "./pages/ServiceDetail";

function App() {
  
  return (
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BookingsProvider>
      <ServiceProvider>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['vendor', 'admin', 'customer']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/add_service" element={<AddService/>}></Route>
        <Route path="/apply" element={
          <ProtectedRoute roles={['admin', 'customer']}>
            <VendorApplication/>
          </ProtectedRoute>
        } />
        <Route path="/vendor-applications" element={<VendorApplicationAdminPage/>}></Route>
        <Route path="/favorites" element={<Favorites/>}></Route>
        <Route path="/service-detail" element={<ServiceDetail/>}></Route>
        <Route path="/unauthorized" element={<Unauthorized/>} />
      </Routes>
      </ServiceProvider>
      </BookingsProvider>
    </ThemeProvider>
    </AuthProvider>
  )
}

export default App
