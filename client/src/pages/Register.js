import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Facebook as FacebookIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { username, email, password, confirmPassword } = formData;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Register: Attempting registration with data:', { 
        username, 
        email, 
        password: '******' 
      });
      const result = await register({ username, email, password });
      console.log('Register: Registration result:', result);
      
      if (result.success) {
        console.log('Register: Registration successful, navigating to homepage...');
        navigate('/');
        
        // If direct navigation doesn't work, try this after a short delay
        setTimeout(() => {
          console.log('Register: Attempting alternative navigation method...');
          window.location.href = '/';
        }, 1000);
      } else {
        console.error('Register: Registration failed:', result.error);
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Register: Unexpected error during registration:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="lg" sx={{ height: '100vh' }}>
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pr: 4,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              color="primary"
              fontWeight={700}
              gutterBottom
            >
              SocialApp
            </Typography>
            <Typography variant="h5" gutterBottom>
              Join SocialApp today and connect with friends around the world.
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6} sm={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              maxWidth: { sm: '450px' },
              mx: 'auto',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{ display: { xs: 'block', md: 'none' }, color: 'primary.main', fontWeight: 700 }}
            >
              SocialApp
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom>
              Create a new account
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="secondary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                By signing up, you agree to our Terms, Privacy Policy, and Cookies Policy.
              </Typography>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    sx={{ 
                      textTransform: 'none', 
                      py: 1,
                      color: '#1877F2',
                      borderColor: '#1877F2',
                      '&:hover': {
                        backgroundColor: 'rgba(24, 119, 242, 0.04)',
                        borderColor: '#1877F2',
                      },
                    }}
                  >
                    Facebook
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{ 
                      textTransform: 'none', 
                      py: 1,
                      color: '#DB4437',
                      borderColor: '#DB4437',
                      '&:hover': {
                        backgroundColor: 'rgba(219, 68, 55, 0.04)',
                        borderColor: '#DB4437',
                      },
                    }}
                  >
                    Google
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                  Already have an account?{' '}
                  <Typography
                    component={Link}
                    to="/login"
                    color="primary"
                    variant="body1"
                    sx={{ textDecoration: 'none', fontWeight: 600 }}
                  >
                    Log in
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register; 