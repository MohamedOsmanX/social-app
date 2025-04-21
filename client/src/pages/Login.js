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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { emailOrUsername, password } = formData;
      
      if (!emailOrUsername || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      console.log('Attempting login...');
      const result = await login(emailOrUsername, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to homepage...');
        // Try direct navigation first
        navigate('/');
        
        // If direct navigation doesn't work, try this after a short delay
        setTimeout(() => {
          console.log('Attempting alternative navigation method...');
          window.location.href = '/';
        }, 1000);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Login error:', err);
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
              Connect with friends and the world around you on SocialApp.
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
              Log in to your account
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
                id="emailOrUsername"
                label="Email or Username"
                name="emailOrUsername"
                autoComplete="email"
                autoFocus
                value={formData.emailOrUsername}
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
                autoComplete="current-password"
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
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Log In'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography
                  variant="body2"
                  component={Link}
                  to="/forgot-password"
                  color="primary"
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot Password?
                </Typography>
              </Box>
              
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
                  Don't have an account?{' '}
                  <Typography
                    component={Link}
                    to="/register"
                    color="primary"
                    variant="body1"
                    sx={{ textDecoration: 'none', fontWeight: 600 }}
                  >
                    Sign up
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

export default Login; 