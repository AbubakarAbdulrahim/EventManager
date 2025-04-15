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

export default function Login(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState({
    length: false,
    alphanum: false,
    specialChar: false,
    uppercase: false,
  });
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState({
    length: "",
    alphanum: "",
    specialChar: "",
    uppercase: "",
  });
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    if (emailError || Object.values(passwordError).some(error => error)) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    navigate("/dashboard")

  };

  const setErrorState = (field, condition, message) => {
    setPasswordError(prevVal => ({ ...prevVal, [field]: !condition }));
    setPasswordErrorMessage(prevVal => ({ ...prevVal, [field]: !condition ? message : '' }));
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    const checks = {
      length: password.value.length >= 8,
      alphanum: /[A-Za-z]/.test(password.value) && /\d/.test(password.value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
      uppercase: /[A-Z]/.test(password.value),
    };

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
      isValid=true
    }

    setErrorState('uppercase', checks.uppercase, 'Password must contain at least one uppercase.');
    setErrorState('alphanum', checks.alphanum, 'Password must contain letters and numbers.');
    setErrorState('specialChar', checks.specialChar, 'Password must contain at least one special character.');
    setErrorState('length', checks.length, 'Password must be at least 8 characters long.');

    if (!checks.uppercase || !checks.alphanum || !checks.specialChar || !checks.length) {
      isValid = false;
    }else{
      isValid =true;
    }

    return isValid;
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
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', color:'#0A7273' }}
          >
            Welcome Back!
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
            <FormControl>
              <FormLabel sx={{color:'#0A7273'}} htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                onChange={validateInputs}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{color:'#0A7273'}} htmlFor="password">Password</FormLabel>
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
                onChange={validateInputs}
              />
              <>
                <Typography fontSize={"0.7rem"} color='error'>{passwordErrorMessage.uppercase}</Typography>
                <Typography fontSize={"0.7rem"} color='error'>{passwordErrorMessage.alphanum}</Typography>
                <Typography fontSize={"0.7rem"} color='error'>{passwordErrorMessage.length}</Typography>
                <Typography fontSize={"0.7rem"} color='error'>{passwordErrorMessage.specialChar}</Typography>
              </>
            </FormControl>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
              <FormControlLabel
                sx={{color:"#0a7273"}}
                control={<Checkbox value="remember" sx={{'&.Mui-checked': { backgroundColor: '#0A7273' }, '&.Mui-checked:hover': { backgroundColor: 'rgba(10, 114, 115, 0.8)' },}} />}
                label="Remember me"
              />
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                color='#0a7273'
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
                backgroundColor: '#0A7273',
                color: '#fff',
                backgroundImage: 'none',
                boxShadow: '1px 1px 2px 0  #033043',
                border:'none',
                '&:hover': { backgroundColor: '#085c5c' }
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
            <Typography sx={{ textAlign: 'center', color:'#0a7273' }}>
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
    </AppTheme>
  );
}