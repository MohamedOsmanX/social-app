import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  Avatar,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = ({ toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SocialApp
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              size="large" 
              color="inherit"
              component={Link}
              to="/"
            >
              <HomeIcon />
            </IconButton>
            
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton size="large" color="inherit">
              <Badge badgeContent={2} color="error">
                <MessageIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              size="large"
              edge="end"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                alt={user?.username} 
                src="/static/images/avatar/1.jpg" 
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          component={Link} 
          to={`/profile/${user?.username}`}
        >
          <Avatar alt={user?.username} src="/static/images/avatar/1.jpg" /> Profile
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsMenuClose}
        onClick={handleNotificationsMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">John Doe liked your post</Typography>
            <Typography variant="caption" color="text.secondary">2 minutes ago</Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Sarah Smith commented on your photo</Typography>
            <Typography variant="caption" color="text.secondary">1 hour ago</Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Mike Johnson started following you</Typography>
            <Typography variant="caption" color="text.secondary">3 hours ago</Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem>
          <Typography variant="body2" color="primary" sx={{ width: '100%', textAlign: 'center' }}>
            See all notifications
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Navbar; 