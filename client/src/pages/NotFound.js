import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h1" 
          color="primary" 
          sx={{ 
            fontSize: { xs: '5rem', sm: '8rem' },
            fontWeight: 700,
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            mb: 3,
            fontWeight: 600,
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: 500,
            mb: 4, 
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or go back to the homepage.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          sx={{ px: 4, py: 1 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound; 