import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import AppleIcon from '@mui/icons-material/Apple';
import { GoogleIcon, FacebookIcon } from '../components/CustomIcons';
import { Select, MenuItem, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SuccessDialog from '../components/SuccessDialog';
import ErrorDialog from '../components/ErrorDialog';
import CircularProgress from '@mui/material/CircularProgress';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Register(props) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone_number: '',
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false)

  const [errors, setErrors] = useState({
    full_name: false,
    username: false,
    email: false,
    phone_number: '',
    password: false,
    confirmPassword: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    phone_number: '',
    confirmPassword: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    alphanum: false,
    specialChar: false,
  });

  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newMessages = { ...errorMessages };
    const newPasswordReqs = { ...passwordRequirements };
    let isValid = true;
    
    switch (name) {
      case 'full_name':
        newErrors.full_name = value.trim() === '';
        newMessages.full_name = value.trim() === '' ? 'Full name is required' : '';
        isValid = !newErrors.full_name;
        break;
        
        case 'username':
          newErrors.username = value.trim() === '';
          newMessages.username = value.trim() === '' ? 'Username is required' : '';
          isValid = !newErrors.username;
        break;

      case 'email':
        const emailValid = /\S+@\S+\.\S+/.test(value);
        newErrors.email = !emailValid;
        newMessages.email = emailValid ? '' : 'Invalid email address';
        isValid = emailValid;
        break;

      case 'phone_number':
        const trimmedPhone = value.trim();
        const phoneValid = /^\+?\d{10,15}$/.test(trimmedPhone); // adjust regex if needed
        newErrors.phone_number = trimmedPhone === '' || !phoneValid;
        newMessages.phone_number = trimmedPhone === ''
          ? 'Phone number is required'
          : (!phoneValid ? 'Invalid phone number' : '');
        isValid = !newErrors.phone_number;
        break;
        

      case 'password':
        newPasswordReqs.length = value.length >= 8;
        newPasswordReqs.uppercase = /[A-Z]/.test(value);
        newPasswordReqs.alphanum = /[A-Za-z]/.test(value) && /\d/.test(value);
        newPasswordReqs.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        const passwordValid = Object.values(newPasswordReqs).every(Boolean);
        newErrors.password = !passwordValid;
        newMessages.password = passwordValid ? '' : 'Password does not meet requirements';
        isValid = passwordValid;
        break;

      case 'confirmPassword':
        const passwordsMatch = value === formData.password;
        newErrors.confirmPassword = !passwordsMatch;
        newMessages.confirmPassword = passwordsMatch ? '' : 'Passwords do not match';
        isValid = passwordsMatch;
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    setErrorMessages(prev => ({ ...prev, [name]: newMessages[name] }));
    if (name === 'password') setPasswordRequirements(newPasswordReqs);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    console.log(formData);
  };

  const validateAllFields = () => {
    let isFormValid = true;
    const fieldNames = ['full_name', 'username', 'email', 'password', 'confirmPassword'];
    
    fieldNames.forEach(name => {
      const isValid = validateField(name, formData[name]);
      if (!isValid) isFormValid = false;
    });
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUsernameError("");

    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      return; // Prevent submission if any errors
    }
    console.log('Form submitted:', formData);
    try {
      const response = await axios.post('http://localhost:8000/user/register/', formData, {
        headers:{'content-type':'application/json'}
      });
      console.log(response.data)
        // return res.data;
        if (response.status === 201) {
        setOpen(true);
        setTimeout(()=>{navigate("/login")}, 2000)
        
      } else {
        alert(response.statusText)
        console.error('Registration failed:', response.status);
      }
    } catch (error) {
      // Handle network or server error
      setOpenError(true)
      setUsernameError('Username already taken');
      

      console.error('Error during registration:', error.message);
    }
    setTimeout(()=>{setLoading(false)}, 2000)
  };

  

  const passwordReqsMet = Object.values(passwordRequirements).every(Boolean);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined" sx={{ alignItems: 'center', overflow: 'visible' }}>
          <img src="/logo.png" height={50} width={50} alt="Logo" />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', color: '#033043' }}
          >
            Sign up!
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {/* Full Name Field */}
            
            <FormControl error={errors.full_name}>
              <FormLabel sx={{ color: '#033043' }}>Full Name</FormLabel>
              <TextField
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                error={errors.full_name}
                helperText={errorMessages.full_name}
                autoFocus
                required
              />
            </FormControl>
            
            <FormControl error={errors.username}>
              <FormLabel sx={{ color: '#033043' }}>Username</FormLabel>
              <TextField
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username || usernameError}
                helperText={errors.username ? errorMessages.username : usernameError}
                // helperText={errorMessages.username}
                autoFocus
                required
              />
            </FormControl>

            {/* Phone Number */}
            <FormControl error={errors.phone_number}>
              <FormLabel sx={{ color: '#033043' }}>Phone Number</FormLabel>
              <TextField
                name="phone_number"
                type="phone"
                value={formData.phone_number}
                onChange={handleChange}
                error={errors.phone_number}
                helperText={errorMessages.phone_number}
                required
              />
            </FormControl>

            {/* Email Field */}
            <FormControl error={errors.email}>
              <FormLabel sx={{ color: '#033043' }}>Email</FormLabel>
              <TextField
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                helperText={errorMessages.email}
                required
              />
            </FormControl>

            {/* Password Field */}
            <FormControl error={errors.password}>
              <FormLabel sx={{ color: '#033043' }}>Password</FormLabel>
              <TextField
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText={errorMessages.password}
                required
              />
              <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color={passwordRequirements.length ? 'success' : 'error'}>
                • At least 8 characters
              </Typography>
              <br />
              <Typography variant="caption" color={passwordRequirements.uppercase ? 'success' : 'error'}>
                • At least one uppercase letter
              </Typography>
              <br />
              <Typography variant="caption" color={passwordRequirements.alphanum ? 'success' : 'error'}>
                • Letters and numbers
              </Typography>
              <br />
              <Typography variant="caption" color={passwordRequirements.specialChar ? 'success' : 'error'}>
                • At least one special character
              </Typography>
            </Box>
            </FormControl>

            {/* Confirm Password Field */}
            <FormControl error={errors.confirmPassword}>
              <FormLabel sx={{ color: '#033043' }}>Confirm Password</FormLabel>
              <TextField
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                helperText={errorMessages.confirmPassword}
                required
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#033043',
                color: '#fff',
                backgroundImage: 'none',
                boxShadow: '1px 1px 2px 0  #033043',
                border:'none',
                '&:hover': { backgroundColor: '#013d56' }
              }}
            >
              {loading ? 
                  <CircularProgress sx={{ color: '#033043'}} size={30} />
                  : 'Register'
                }
            </Button>
          </Box>

          <Divider>or</Divider>
          
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              sx={{ borderRadius: '22px' }}
            >
              <GoogleIcon />
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              sx={{ borderRadius: '22px' }}
            >
              <FacebookIcon />
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Apple')}
              sx={{ borderRadius: '22px' }}
            >
              <AppleIcon />
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', color: '#033043' }}>
            Already have an account?{' '}
            <Link href="/login" sx={{ color: '#033043' }}>
              Login
            </Link>
          </Typography>
        </Card>
      </SignInContainer>
      <SuccessDialog open={open} handleClose={()=> {setOpen(false)}} url={'/login'} title={'Registration successful! Please log in.'} />
      <ErrorDialog open={openError} handleClose={()=>{setOpenError(false)}} title={'Registration failed'} body={usernameError}/>
    </AppTheme>
  );
}