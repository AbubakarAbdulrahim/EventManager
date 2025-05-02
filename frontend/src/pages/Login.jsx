import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../components/ForgotPassword';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
import AppleIcon from '@mui/icons-material/Apple';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../components/CustomIcons';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState,useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

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

const validationSchema = yup.object({
  username: yup
    .string('Enter your username')
    .required('username is required'),
  password: yup.string()
    // .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required')
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-zA-Z]/, "Must contain at least one letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character")
});

export default function Login(props) {
  const [formData, setFormData] = useState({
      username: "",
      password: "",
    });
    const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
    const { user, loading, login } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!loading && user) {
        navigate('/dashboard');
      }
    }, [user,loading, navigate]);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {

        await login(values);
        // If login is successful, redirect to dashboard
        // navigate('/dashboard');
        // Optionally, you can also show a success message or perform other actions here
        
      } catch (error) {
        console.error('Login failed:', error);
        if (error.response) {
          // Server responded with 4xx/5xx status
          const { data } = error.response;
          
          if (error.response.status === 400) {
            setError(data.detail || 'Invalid email or password format');
          } else if (error.response.status === 401) {
            setError('Invalid credentials');
          } else {
            setError('Login failed. Please try again later.');
          }
        } else if (error.request) {
          // No response received
          setError('Network error. Please check your connection.');
        } else {
          // Other errors
          setError('An unexpected error occurred.');
        }
      }
    
      // alert(JSON.stringify(values, null, 2));
      // navigate("/dashboard")
    },
  })

  const {password} = formik.values
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    alphanumeric: /[a-zA-Z]/.test(password) && /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined" sx={{alignItems:'center', overflow:'visible'}}>
          {/* <SitemarkIcon /> */}
          <img src="/logo.png" height={50} width={50}/>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', color:'#033043' }}
          >
            Welcome Back!
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel sx={{color:'#033043'}} htmlFor="username">Username</FormLabel>
              <TextField
                // error={emailError}
                // helperText={emailErrorMessage}
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                // color={emailError ? 'error' : 'primary'}
                // onChange={validateInputs}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{color:'#033043'}} htmlFor="password">Password</FormLabel>
              <TextField
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                // onChange={validateInputs}
                value={password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && "Password is required"}
              />
              {/* <Box ml={1} mt={1}>
              <Typography variant="body2" color={checks.length ? "success.main" : "error"}>
                • Minimum 8 characters
              </Typography>
              <Typography variant="body2" color={checks.uppercase ? "success.main" : "error"}>
                • At least one uppercase letter
              </Typography>
              <Typography variant="body2" color={checks.alphanumeric ? "success.main" : "error"}>
                • Must contain alphanumeric (letter and number)
              </Typography>
              <Typography variant="body2" color={checks.specialChar ? "success.main" : "error"}>
                • At least one special character
              </Typography>
            </Box> */}
            </FormControl>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
              <FormControlLabel
                sx={{color:"#033043"}}
                control={<Checkbox value="remember" sx={{'&.Mui-checked': { backgroundColor: '#033043' }, '&.Mui-checked:hover': { backgroundColor: 'rgba(10, 114, 115, 0.8)' },}} />}
                label="Remember me"
              />
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                color='#033043'
              >
                Forgot your password?
              </Link>
            </Box>
            <ForgotPassword open={open} handleClose={handleClose} />
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
              
              // color='#000'
            >
              Sign in
            </Button>
          </Box>
          <Divider >or</Divider>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              sx={{borderRadius:'22px', width:'100%'}}
            >
              <GoogleIcon />
            </Button>
            <Button
              sx={{borderRadius:'22px'}}
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
            >
              <FacebookIcon />
              
            </Button>
            <Button
              sx={{borderRadius:'22px'}}
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
            >
              <AppleIcon/>
              
            </Button>
          </Box>
            <Typography sx={{ textAlign: 'center', color:'#033043' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: 'center', color:'#033043' }}
              >
                Sign up
              </Link>
            </Typography>
        </Card>
      </SignInContainer>
      {error && (
        <Snackbar
        open={Boolean(error)}
        autoHideDuration={2000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)}  severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      )}
    </AppTheme>
  );
}