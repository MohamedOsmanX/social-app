import React, { useState } from 'react';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Box>
      <Navbar toggleMobileMenu={toggleMobileMenu} />
      <Stack 
        direction="row" 
        spacing={2}
        sx={{ 
          pt: 8,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Left Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              position: 'sticky',
              top: 72,
              height: 'calc(100vh - 72px)',
              overflowY: 'auto',
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* Mobile Sidebar - shown when menu is open */}
        {isMobile && mobileMenuOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 64,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 64px)',
              bgcolor: 'background.paper',
              zIndex: 1200,
              overflowY: 'auto',
            }}
          >
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            py: 2,
            px: isMobile ? 1 : 2,
            width: isMobile 
              ? '100%' 
              : isTablet 
                ? 'calc(100% - 280px)' 
                : 'calc(100% - 580px)',
            maxWidth: '750px',
            mx: 'auto',
          }}
        >
          {children}
        </Box>

        {/* Right Sidebar - only show on desktop */}
        {!isTablet && (
          <Box
            sx={{
              width: 300,
              flexShrink: 0,
              position: 'sticky',
              top: 72,
              height: 'calc(100vh - 72px)',
              overflowY: 'auto',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <RightSidebar />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Layout; 