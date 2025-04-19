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

function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BookingsProvider>
      <ServiceProvider>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/favorites" element={<Favorites/>}></Route>

      </Routes>
      </ServiceProvider>
      </BookingsProvider>
    </ThemeProvider>
  )
}

export default App
